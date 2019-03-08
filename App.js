const express = require('express');
const faker = require('faker');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const urlEncodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
app.listen(2020, () => console.log('App listening 2020 port'));
app.set('view engine', 'ejs');

// Nos conectamos con la BD 'alumnos_p5'
mongoose.connect('mongodb://localhost/alumnos_p5');

// Esquema de nuestra colección 'alumnos'
const alumnoSchema = new mongoose.Schema({
	nombre: { type: String, required: true },
	apellido: { type: String, required: true },
	email: { type: String, required: true },
	curso: { type: String, required: true, enum: ['Backend', 'Frontend', 'Bootcamp'] },
	genero: { type: String, enum: ['M', 'F', 'X'] },
	pais: { type: String, default: 'Argentina' },
	fecha_nacimiento: String,
	avatar: String,
	edad: Number
}, { versionKey: false });

// Creo el modelo para comenzar a hacer consultas
const Alumno = mongoose.model('alumnos', alumnoSchema);

// Insertar alumnos Fake
Alumno.find({}, (error, result) => {
	if (error) {
		console.log(error);
		return;
	}

	if (result.length <= 0) {
		var cursos = ['Backend', 'Frontend', 'Bootcamp'];
		var generos = ['M', 'F', 'X'];

		for (var i = 1; i <= 30; i++) {
			Alumno.create({
				nombre: faker.name.firstName(),
				apellido: faker.name.lastName(),
				email: faker.internet.email(),
				curso: cursos[Math.floor(Math.random() * 3)],
				genero: generos[Math.floor(Math.random() * 3)],
				pais: faker.address.country(),
				avatar: faker.image.avatar(),
				edad: Math.floor(Math.random() * 57)
			});
		}
	}
});

app.get('/', (req, res) => {
	Alumno.find({}, (error, result) => {
		if (error) {
			console.log(error);
		}
		res.render('index', {
			alumnos: result
		});
	});
});

app.get('/detalle/:nombre', (req, res) => {
	Alumno.findById(req.query.id, (error, result) => {
		if (error) {
			res.send('No se encontró el alumno');
		}
		res.render('detalle', {
			alumno: result
		});
	});
});

app.get('/crear', (req, res) => {
	res.render('formulario');
});

app.post('/crear', urlEncodedParser, (req, res) => {
	req.body.fecha_nacimiento = req.body.anio + '-' + req.body.mes + '-' + req.body.dia;

	Alumno.create(req.body, (error, result) => {
		if (error) {
			res.send('No se pudo guardar en la DB');
		}
		res.redirect('/');
	});
});

app.post('/delete', urlEncodedParser, (req, res) => {
	res.send('Vas a eliminar al usuario con ID: ' + req.body.id);
});
