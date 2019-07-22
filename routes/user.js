// Requires
var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuthentication = require('../middlewares/authentication');


//Inicializar variables
var app = express();

var User = require('../models/user')

// ========================================
// Obtener todos los usuarios
// ========================================


app.get('/', (req, res, next) => {

    User.find({}, 'name email role')
        .exec(

            (err, users) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en la carga de usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    users: users
                });

            })

});



// ========================================
// Actualizar un nuevo usuario
// ========================================

app.put('/:id', mdAuthentication.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!user) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el ' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userSaved) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            userSaved.password = ':)';

            res.status(200).json({
                ok: true,
                user: userSaved
            });


        });

    });

});


// ========================================
// Crear un nuevo usuario
// ========================================
app.post('/', mdAuthentication.verificaToken, (req, res) => {


    var body = req.body;
    var rigths = req.user.role;

    if (rigths != 'ADMIN_ROLE') {
        res.status(401).json({
            ok: false,
            message: { message: 'metodo no permitido a usuarios normales' }
        });
    }

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, savedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error en la creación de usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: savedUser,
            userToken: req.user
        });
    });




});

// ========================================
//  Borrar un Usuario por id
// ========================================

app.delete('/:id', mdAuthentication.verificaToken, (req, res) => {

    var id = req.params.id;
    console.log(id);
    User.findByIdAndRemove(id, (err, deletedUser) => {
        console.log();
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                errors: { message: 'No existe usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            user: deletedUser
        });


    });
});

module.exports = app;