document.addEventListener('DOMContentLoaded', () => {
  // Variables
  let carrito = [];
  const pesos = '$';
  const DOMitems = document.querySelector('#items');
  const DOMcarrito = document.querySelector('#carrito');
  const DOMtotal = document.querySelector('#total');
  const DOMbotonVaciar = document.querySelector('#boton-vaciar');
  const DOMbotonComprar = document.querySelector('#boton-comprar');
  const miLocalStorage = window.localStorage;
  const baseDeDatos = [];


  //Aplicando fetch//
  function renderizarProductos() {
    fetch("./js/fogoneros.json")
      .then(response => response.json())
      .then(json =>
        json.forEach(json => {

          // Estructura
          const miNodo = document.createElement('div');
          miNodo.classList.add('card', 'col-sm-4',);
          miNodo.style.backgroundColor = "rgb(75, 74, 74)"
          // Body
          const miNodoCardBody = document.createElement('div');
          miNodoCardBody.classList.add('card-body');

          // Titulo
          const miNodoTitle = document.createElement('h5');
          miNodoTitle.classList.add('card-title');
          miNodoTitle.textContent = json.nombre;
          // Imagen
          const miNodoImagen = document.createElement('img');
          miNodoImagen.classList.add('img-fluid', 'rounded');
          miNodoImagen.setAttribute('src', json.imagen);
          // Precio
          const miNodoPrecio = document.createElement('p');
          miNodoPrecio.classList.add('card-text');
          miNodoPrecio.textContent = `${pesos}${json.precio}`;
          // Boton 
          const miNodoBoton = document.createElement('button');
          miNodoBoton.classList.add('btn', 'btn-primary');
          miNodoBoton.textContent = '+';
          miNodoBoton.setAttribute('marcador', json.id);
          miNodoBoton.addEventListener('click', addProductoAlCarrito);
          // Insertamos
          miNodoCardBody.appendChild(miNodoImagen);
          miNodoCardBody.appendChild(miNodoTitle);
          miNodoCardBody.appendChild(miNodoPrecio);
          miNodoCardBody.appendChild(miNodoBoton);
          miNodo.appendChild(miNodoCardBody);
          DOMitems.appendChild(miNodo);
          baseDeDatos.push(json);



        }));
  }

  function addProductoAlCarrito(evento) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: 'Se añadio con exito al carrito'
    })

    carrito.push(evento.target.getAttribute('marcador'))

    renderizarCarrito();

  }

  function renderizarCarrito() {
    DOMcarrito.textContent = '';
    const carritoSinDuplicados = [...new Set(carrito)];
    carritoSinDuplicados.forEach((item) => {

      const miItem = baseDeDatos.filter((itemBaseDatos) => {
        // ¿Coincide las id? Solo puede existir un caso
        return itemBaseDatos.id === parseInt(item);
      });
      // Cuenta el número de veces que se repite el producto
      const numeroUnidadesItem = carrito.reduce((total, itemId) => {
        // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
        return itemId === item ? total += 1 : total;
      }, 0);

      const miNodo = document.createElement('li');
      miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
      miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${pesos} ${miItem[0].precio}`;

      //Sacar Producto
      const miBoton = document.createElement('button');
      miBoton.classList.add('btn', 'btn-danger', 'mx-5');
      miBoton.textContent = 'Eliminar';
      miBoton.style.marginLeft = '1rem';
      miBoton.dataset.item = item;
      miBoton.addEventListener('click', borrarItemCarrito);

      miNodo.appendChild(miBoton);
      DOMcarrito.appendChild(miNodo);
    });

    DOMtotal.textContent = calcularTotal();
  }


  function borrarItemCarrito(evento) {


    const id = evento.target.dataset.item;

    carrito = carrito.filter((carritoId) => {
      return carritoId !== id;
    });


    renderizarCarrito();
    guardarCarritoEnLocalStorage();
  }

  /**
  * Calcula el precio total teniendo en cuenta los productos repetidos
  */
  function calcularTotal() {
    // Recorremos el array del carrito 
    return carrito.reduce((total, item) => {
      // De cada elemento obtenemos su precio
      const miItem = baseDeDatos.filter((itemBaseDatos) => {
        return itemBaseDatos.id === parseInt(item);
      });
      // Los sumamos al total
      return total + miItem[0].precio;
    }, 0).toFixed(2);
  }

  function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function cargarCarritoDeLocalStorage() {

    if (miLocalStorage.getItem('carrito') !== null) {
      // Carga la información
      carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
  }
  function comprarCarrito() {
    Swal.fire(
      'Disculpe',
      'Su compra no ha sido valida.',
      'question'
    )
  }
  DOMbotonComprar.addEventListener('click', comprarCarrito);
  function vaciarCarrito() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'warning',
      title: 'Su Carrito ha sido Vaciado.'
    })
    carrito = [];

    renderizarCarrito();
    localStorage.clear();
  }

  DOMbotonVaciar.addEventListener('click', vaciarCarrito);

  cargarCarritoDeLocalStorage();
  renderizarProductos();
  renderizarCarrito();
});