(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.galeria').forEach(el => {
    const datos = ARTISTAS[el.dataset.artista];
    if (!datos) return;

    const numeros = Array.from({ length: datos.cantidad }, (_, i) => i + 1)
      .filter(n => !(datos.omitir || []).includes(n));
    const obras = numeros.map((n, i) => {
      const o = datos.obras[i] || {};
      return {
        src: datos.ruta(n),
        titulo: o.titulo || `Obra ${i + 1}`,
        tecnica: o.tecnica || '',
        texto: o.texto || 'Pronto vas a poder leer acá la explicación de este trabajo.'
      };
    });

    el.innerHTML = `
      <div class="escena" tabindex="0" aria-roledescription="carrusel" aria-label="Obras de ${el.closest('section').querySelector('h2').textContent}">
        <div class="vitrina">
          <button class="flecha prev" type="button" aria-label="Obra anterior">&#8249;</button>
          <figure class="marco"><div class="paspartu"><img alt=""><p class="falta"></p></div></figure>
          <button class="flecha next" type="button" aria-label="Obra siguiente">&#8250;</button>
        </div>
        <aside class="cartel" aria-live="polite">
          <p class="cartel-n"></p>
          <h3 class="cartel-titulo"></h3>
          <p class="cartel-tecnica"></p>
          <p class="cartel-texto"></p>
        </aside>
      </div>
      <div class="barra"><span></span></div>
      <div class="puntos" role="tablist"></div>`;

    const escena = el.querySelector('.escena');
    const img = el.querySelector('.marco img');
    const marco = el.querySelector('.marco');
    const cartel = el.querySelector('.cartel');
    const barra = el.querySelector('.barra span');
    const puntos = el.querySelector('.puntos');
    const paspartu = el.querySelector('.paspartu');

    // si una imagen no carga, prueba otras carpetas y extensiones comunes
    function candidatos(src) {
      const i = src.lastIndexOf('/');
      const archivo = src.slice(i + 1);
      const nombre = archivo.replace(/\.[^.]+$/, '');
      const ext = archivo.split('.').pop();
      const out = [];
      [src.slice(0, i + 1), 'img/', 'imagenes/', 'images/', ''].forEach(f =>
        [ext, 'jpg', 'jpeg', 'png', 'webp'].forEach(e => {
          const c = f + nombre + '.' + e;
          if (!out.includes(c)) out.push(c);
        }));
      return out;
    }
    function cargar(o) {
      const lista = candidatos(o.src);
      let k = 0;
      paspartu.classList.remove('sin-imagen');
      img.onload = () => paspartu.classList.remove('sin-imagen');
      img.onerror = () => {
        k++;
        if (k < lista.length) img.src = lista[k];
        else {
          paspartu.querySelector('.falta').textContent = 'No se encontró la imagen: ' + o.src;
          paspartu.classList.add('sin-imagen');
        }
      };
      img.src = lista[0];
    }
    let actual = 0, timer = null, pausado = false, visible = false;

    obras.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Ir a la obra ${i + 1}`);
      b.addEventListener('click', () => { ir(i); reiniciar(); });
      puntos.appendChild(b);
    });

    function ir(i) {
      actual = (i + obras.length) % obras.length;
      const o = obras[actual];
      marco.classList.add('cambiando');
      cartel.classList.add('cambiando');
      setTimeout(() => {
        cargar(o);
        img.alt = `${o.titulo}`;
        cartel.querySelector('.cartel-n').textContent = `${actual + 1} de ${obras.length}`;
        cartel.querySelector('.cartel-titulo').textContent = o.titulo;
        cartel.querySelector('.cartel-tecnica').textContent = o.tecnica;
        cartel.querySelector('.cartel-texto').textContent = o.texto;
        marco.classList.remove('cambiando');
        cartel.classList.remove('cambiando');
      }, 220);
      [...puntos.children].forEach((p, k) => p.classList.toggle('activo', k === actual));
      // precarga la siguiente
      new Image().src = obras[(actual + 1) % obras.length].src;
    }

    function arrancarBarra() {
      barra.style.animation = 'none';
      void barra.offsetWidth;
      if (!reduceMotion) barra.style.animation = `llenar ${TIEMPO_AUTOMATICO}ms linear forwards`;
    }
    function reiniciar() {
      clearTimeout(timer);
      arrancarBarra();
      if (reduceMotion || pausado || !visible) { barra.style.animationPlayState = 'paused'; return; }
      barra.style.animationPlayState = 'running';
      timer = setTimeout(() => { ir(actual + 1); reiniciar(); }, TIEMPO_AUTOMATICO);
    }
    function pausar(v) {
      pausado = v;
      if (v) { clearTimeout(timer); barra.style.animationPlayState = 'paused'; }
      else reiniciar();
    }

    el.querySelector('.prev').addEventListener('click', () => { ir(actual - 1); reiniciar(); });
    el.querySelector('.next').addEventListener('click', () => { ir(actual + 1); reiniciar(); });
    escena.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { ir(actual - 1); reiniciar(); }
      if (e.key === 'ArrowRight') { ir(actual + 1); reiniciar(); }
    });
    escena.addEventListener('mouseenter', () => pausar(true));
    escena.addEventListener('mouseleave', () => pausar(false));
    escena.addEventListener('focusin', () => pausar(true));
    escena.addEventListener('focusout', () => pausar(false));

    // deslizar con el dedo en el celular
    let x0 = null;
    escena.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    escena.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { ir(actual + (dx < 0 ? 1 : -1)); reiniciar(); }
      x0 = null;
    });

    // solo avanza solo cuando la sala está a la vista
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      reiniciar();
    }, { threshold: 0.4 }).observe(el);

    ir(0);
  });
})();