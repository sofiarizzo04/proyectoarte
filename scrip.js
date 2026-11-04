/* ============================================================
   EDITÁ ACÁ: nombre, carpeta/prefijo de imágenes y descripciones.
   Cada obra: { titulo, desc }. Si hay menos obras que "cantidad",
   las que falten usan un texto por defecto.
   ============================================================ */
const artistas = [
  {
    id: "estefaniaferreira", nombre: "Estefania Ferreira",
    cantidad: 18, src: n => `imagenes/a1-${n}.jpg`,
    obras: [
      { titulo: "Obra 1", desc: "Escribí acá la explicación de esta obra: técnica, materiales, idea." },
      // { titulo: "Obra 2", desc: "..." },
    ]
  },
  {
    id: "sofiajuarez", nombre: "Sofia Juarez",
    cantidad: 18, src: n => `imagenes/a2-${n}.jpg`,
    obras: []
  },
  {
    id: "sofiarizzo", nombre: "Sofia Rizzo",
    cantidad: 18, src: n => `imagenes/a2-${n}.jpg`,
    obras: []
  },
  {
    id: "brisascomazzon", nombre: "Brisa Scomazzon",
    cantidad: 18, src: n => `img/tp${n}brisas.jpeg`,
    obras: []
  }
];

/* ---------------- Construcción de la página ---------------- */
const menu = document.getElementById("menu");
const galeria = document.getElementById("galeria");

artistas.forEach(a => {
  // botón del menú
  menu.insertAdjacentHTML("beforeend", `<a class="boton" href="#${a.id}">${a.nombre}</a>`);

  // datos de cada obra
  const obras = Array.from({ length: a.cantidad }, (_, i) => ({
    src: a.src(i + 1),
    titulo: a.obras[i]?.titulo ?? `Obra ${i + 1}`,
    desc: a.obras[i]?.desc ?? "Próximamente: descripción de esta obra."
  }));

  const sec = document.createElement("section");
  sec.className = "artista";
  sec.id = a.id;
  sec.innerHTML = `
    <h2>${a.nombre}</h2>
    <div class="carrusel" role="region" aria-roledescription="carrusel" aria-label="Obras de ${a.nombre}">
      <div class="visor" tabindex="0">
        ${obras.map(o => `<img loading="lazy" src="${o.src}" alt="${o.titulo} de ${a.nombre}">`).join("")}
      </div>
      <button class="flecha prev" aria-label="Obra anterior">&#8249;</button>
      <button class="flecha next" aria-label="Obra siguiente">&#8250;</button>
    </div>
    <div class="info" aria-live="polite">
      <span class="contador"></span>
      <h3></h3>
      <p></p>
    </div>
    <div class="puntos">
      ${obras.map((_, i) => `<button class="punto" aria-label="Ir a la obra ${i + 1}"></button>`).join("")}
    </div>
    <a class="volver" href="#inicio">&uarr; Volver al inicio</a>`;
  galeria.appendChild(sec);

  iniciarCarrusel(sec, obras);
});

/* ---------------- Lógica del carrusel ---------------- */
function iniciarCarrusel(sec, obras) {
  const visor = sec.querySelector(".visor");
  const prev = sec.querySelector(".prev");
  const next = sec.querySelector(".next");
  const info = sec.querySelector(".info");
  const contador = info.querySelector(".contador");
  const titulo = info.querySelector("h3");
  const desc = info.querySelector("p");
  const puntos = [...sec.querySelectorAll(".punto")];
  let actual = -1;

  function mostrar(i) {
    if (i === actual) return;
    actual = i;
    info.classList.add("cambiando");
    setTimeout(() => {
      contador.textContent = `Obra ${i + 1} de ${obras.length}`;
      titulo.textContent = obras[i].titulo;
      desc.textContent = obras[i].desc;
      info.classList.remove("cambiando");
    }, 150);
    puntos.forEach((p, k) => p.classList.toggle("activo", k === i));
    prev.disabled = i === 0;
    next.disabled = i === obras.length - 1;
  }

  function ir(i) {
    i = Math.max(0, Math.min(obras.length - 1, i));
    visor.scrollTo({ left: i * visor.clientWidth });
  }

  // el índice sale de la posición del scroll (funciona con flechas, teclado, puntos y swipe)
  visor.addEventListener("scroll", () => {
    mostrar(Math.round(visor.scrollLeft / visor.clientWidth));
  }, { passive: true });

  prev.addEventListener("click", () => ir(actual - 1));
  next.addEventListener("click", () => ir(actual + 1));
  puntos.forEach((p, i) => p.addEventListener("click", () => ir(i)));

  // flechas del teclado (cuando el carrusel tiene el foco)
  visor.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); ir(actual + 1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); ir(actual - 1); }
    if (e.key === "Home") { e.preventDefault(); ir(0); }
    if (e.key === "End")  { e.preventDefault(); ir(obras.length - 1); }
  });

  mostrar(0);
}