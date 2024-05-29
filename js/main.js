let carrito = [];
let productos = []; 
window.onload = function() {
    cargarCarritoDesdeLocalStorage();
    actualizarCarrito();
    cargarProductosDesdeServidor();
};

function cargarProductosDesdeServidor() {
    fetch("./data/productos.json")
        .then(response => response.json())
        .then(data => {
            productos = data;
            mostrarProductos();
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

function mostrarProductos() {
    let tiendaProductos = document.getElementById('tienda-productos'); 
    tiendaProductos.innerHTML = '';
    productos.forEach((producto, index) => {
        let card = document.createElement('div');
        card.className = 'card';
        card.style.opacity = 0;
        card.innerHTML = `
       <img src="../recursos/${producto.imagen}" alt="${producto.nombre}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
                <button class="btn" onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">Agregar al Carrito</button>
            </div>
        `;
        tiendaProductos.appendChild(card);

        gsap.to(card, { opacity: 1, duration: 0.5, delay: index * 0.1 });
    });
}

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
    mostrarMensaje(`${nombre} agregado al carrito.`);
}

function actualizarCarrito() {
    let total = carrito.reduce((acc, item) => acc + item.precio, 0).toFixed(2);
    let carritoCounter = document.getElementById('carrito-counter');
    let carritoTotal = document.getElementById('carrito-total');
    let carritoLista = document.getElementById('carrito-lista');


    if (carrito.length > 0) {
        carritoCounter.innerText = carrito.length; 
    } else {
        carritoCounter.innerText = "Carrito"; 
    }

    carritoTotal.innerText = `$${total}`;

    carritoLista.innerHTML = '';
    carrito.forEach((item, index) => {
        let li = document.createElement('li');
        li.innerHTML = `<span>${item.nombre}</span> - $${item.precio.toFixed(2)} <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">&times;</button>`;
        carritoLista.appendChild(li);
    });
}

function mostrarMensaje(mensaje) {
    var mensajeDiv = document.getElementById("mensaje");
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.display = "block";
    setTimeout(function() {
        mensajeDiv.style.display = "none";
    }, 2000);
}

function agregarAlCarrito() {

    mostrarMensaje("Producto agregado con éxito");
}

function mostrarCarrito() {
    let carritoPopup = document.getElementById('carrito-popup');
    carritoPopup.style.display = 'block';
}

function cerrarCarrito() {
    let carritoPopup = document.getElementById('carrito-popup');
    carritoPopup.style.display = 'none';
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
}

function finalizarCompra() {
    carrito = [];
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
    mostrarMensaje('¡Compra realizada con éxito!');
}

function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
    mostrarMensaje('Carrito vaciado.');
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
    let carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}
