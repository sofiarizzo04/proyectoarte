/* ============================================================
   AQUÍ SE EDITAN LOS TEXTOS DE CADA OBRA.
   Cada artista tiene una lista "obras": una por imagen, en orden.
   Cada obra lleva: titulo, tecnica (opcional) y texto (la explicación).
   Si falta una obra, se muestra un texto de relleno.
   "omitir" sirve para saltear números de imagen que no existen.
   Los textos van en el orden en que se ven en el carrusel.
   ============================================================ */
const ARTISTAS = {
  estefaniaferreira: {
    cantidad: 18,
    ruta: n => `imagenes/a1-${n}.jpg`,
    obras: [
      { titulo: "Título de la obra 1", tecnica: "Técnica y materiales", texto: "Explicá acá de qué trata el trabajo, qué idea querías transmitir y cómo lo hiciste." },
      { titulo: "Título de la obra 2", tecnica: "Técnica y materiales", texto: "Explicación de la obra 2." }
      // ...seguí agregando hasta la 18
    ]
  },
  sofiajuarez: {
    cantidad: 18,
    ruta: n => `imagenes/a2-${n}.jpg`,
    obras: [
      { titulo: "Título de la obra 1", tecnica: "Técnica y materiales", texto: "Explicación de la obra 1." }
    ]
  },
  sofiarizzo: {
    cantidad: 18,
    ruta: n => `imagenes/a3-${n}.jpg`,   // ← antes apuntaba a a2: renombrá tus fotos a a3-1.jpg, a3-2.jpg...
    obras: [
      { titulo: "Título de la obra 1", tecnica: "Técnica y materiales", texto: "Explicación de la obra 1." }
    ]
  },
  brisascomazzon: {
    cantidad: 18,
    omitir: [13],                      // no existe tp13brisas.jpeg, se salta
    ruta: n => `img/tp${n}brisas.jpeg`,
    obras: [
      { titulo: "Título de la obra 1", tecnica: "Técnica y materiales", texto: "Explicación de la obra 1." }
    ]
  }
};

const TIEMPO_AUTOMATICO = 6000; // milisegundos entre una obra y la siguiente