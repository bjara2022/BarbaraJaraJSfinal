const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const botonVaciar = document.getElementById('vaciar-carrito');
const contadorCarrito = document.getElementById('contadorCarrito');
const cantidad = document.getElementById('cantidad');
const precioTotal = document.getElementById('precioTotal');
const cantidadTotal = document.getElementById('cantidadTotal');
let response;
let data;
let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
	if (localStorage.getItem('carrito')) {
		carrito = JSON.parse(localStorage.getItem('carrito'));
		actualizarCarrito();
	}
});

botonVaciar.addEventListener('click', () => {
	carrito.length = 0;
	localStorage.clear();
	actualizarCarrito();
});

//Renderizo el carrito con fetch desde un archivo JSON
const renderCarrito = async () => {
	try {
		response = await fetch('../stock.JSON');
		data = await response.json();

		data.forEach((producto) => {
			const div = document.createElement('div');
			div.classList.add('card');
			div.innerHTML = `
        <div class="card" style="width: 18rem;">
    <img src=${producto.img} class="card-img-top" alt= "">
    <div class="card-body">
    <h5 class="card-title">${producto.nombre}</h5>
    <p class="card-text">Precio:$ ${producto.precio}</p>   
    <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
    </div>
    </div>
    `;
			contenedorProductos.appendChild(div);

			const boton = document.getElementById(`agregar${producto.id}`);
			boton.addEventListener('click', () => {
				agregarAlCarrito(producto.id);
			});
		});
	} catch (error) {
		console.log(error);
	}
};

renderCarrito();

const agregarAlCarrito = (prodId) => {
	const existe = carrito.some((prod) => prod.id === prodId);
	if (existe) {
		const prod = carrito.map((prod) => {
			if (prod.id === prodId) {
				prod.cantidad++;
			}
		});
	} else {
		const item = data.find((prod) => prod.id === prodId);
		carrito.push(item);
	}

	actualizarCarrito();
};

const eliminarDelCarrito = (prodId) => {
	const item = carrito.find((prod) => prod.id === prodId);
	const indice = carrito.indexOf(item);
	carrito.splice(indice, 1);

	if (carrito.length === 0) {
		localStorage.clear();
	}
	actualizarCarrito();
};

const actualizarCarrito = () => {
	contenedorCarrito.innerHTML = '';

	carrito.forEach((prod) => {
		const div = document.createElement('div');
		div.className = 'productoEnCarrito';
		div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i>Eliminar</button>
        `;

		contenedorCarrito.appendChild(div);
		localStorage.setItem('carrito', JSON.stringify(carrito));
	});

	contadorCarrito.innerText = carrito.length;
	precioTotal.innerText = carrito.reduce(
		(acc, prod) => acc + prod.cantidad * prod.precio,
		0
	);
};
