var Users = require('./models/user'),
    City = require('./models/city'),
    Bairro = require('./models/bairro'),
    func = require('../config/functions'),
    facebook = require('../config/facebook.js'),
    ip = require('ip'),
    fs = require("fs"),
    nodemailer = require("nodemailer");


// Session check function
var sessionReload = function(req, res, next){
    if('HEAD' == req.method || 'OPTIONS' == req.method){
        return next();
    }else{
        req.session._garbage = Date();
        req.session.touch();
    }
}


module.exports = function (app, passport, mongoose) {

    app.route('/')
        .get(function (req, res, next) {
            var user = req.user;
            if (!user) {
                res.render('index', { title: 'Guia de Cidades e Bairros Benvenuto' });
            } else {
                res.render('index', { title: 'Guia de Cidades e Bairros Benvenuto', user: user });
            }

        });


    app.get('/cidade/:cidade', function (req, res) {
        var user = req.user;
        if (!user) {
            res.render('cidade', { title: 'Guia de Cidades e Bairros Benvenuto' });
        } else {
            City.findOne({ slug: req.params.cidade, status: "publicado" }, function (err, docs) {
                if (err)
                    throw err

                if (docs != undefined) {
                    res.render('cidade', { title: docs.nomeCidade + 'Guia de Cidades e Bairros Benvenuto', user: user, docs: docs });
                } else {
                    res.redirect('/');
                }

            });

        }
    });

    app.get('/bairro/:bairro', function (req, res) {
        var user = req.user;
        if (!user) {
            res.render('cidade', { title: 'Guia de Cidades e Bairros Benvenuto' });
        } else {
            Bairro.findOne({ slug: req.params.bairro, status: "publicado" }, function (err, docs) {
                if (err)
                    throw err

                if (docs != undefined) {
                    docs.slugCidade = func.string_to_slug(docs.nomeCidade)
                    docs.bairro1word = func.getNthWord(docs.nomeBairro, 1);
                    docs.bairro2word = func.getNthWord(docs.nomeBairro, 2);
                    res.render('bairro', { title: docs.nomeBairro + 'Guia de Cidades e Bairros Benvenuto', user: user, docs: docs });
                } else {
                    res.redirect('/');
                }

            });

        }
    });

    app.get('/painel', function (req, res) {
        var user = req.user;
        if (!user) {
            res.redirect('/')
        } else {
            City.find({}, function (err, docs) {
                Bairro.find({}, function (err, docs2) {
                    for (i = 0; i < docs.length; i++) {
                        var timeStamp = docs[i]._id.toString().substring(0, 8);
                        var date = new Date(parseInt(timeStamp, 16) * 1000);
                        docs[i].date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                    }
                    for (i = 0; i < docs2.length; i++) {
                        var timeStamp = docs2[i]._id.toString().substring(0, 8);
                        var date = new Date(parseInt(timeStamp, 16) * 1000);
                        docs2[i].date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                    }
                    res.render('painel', { title: "Painel Guia Benvenuto", user: user, cidades: docs, bairros: docs2 });
                });
            });

        }
    });

    app.get('/novaCidade', function (req, res) {
        var user = req.user
        if (!user) {
            res.redirect('/')
        } else {
            res.render('novaCidade', { title: "Painel Guia Benvenuto", user: user });
        }
    });

    app.get('/novoBairro', function (req, res) {
        var user = req.user
        if (!user) {
            res.redirect('/')
        } else {
            res.render('novoBairro', { title: "Painel Guia Benvenuto", user: user });
        }
    });

    app.post('/novaCidade', function (req, res) {
        var user = req.user;
        var uploads = req.files;
        var content = req.body;

        var tags = content.tags.split(',');

        var razoes = [{ razao: content.razao1, iconerazao: content.iconerazao1, descricaorazao: content.descricaorazao1 }, { razao: content.razao2, iconerazao: content.iconerazao2, descricaorazao: content.descricaorazao2 }, { razao: content.razao3, iconerazao: content.iconerazao3, descricaorazao: content.descricaorazao3 }, { razao: content.razao4, iconerazao: content.iconerazao4, descricaorazao: content.descricaorazao4}];

        var conhecida = content.conhecidaPor.split(',');
        console.log(content.caracteristicas)
        var carac = content.caracteristicas;

        if (!user) {
            res.redirect('/')
        } else {
            console.log(uploads.fotoDestaque.name)
            new City({
                nomeCidade: content.nomeCidade,
                sigla: content.sigla,
                headline: content.headline,
                slug: func.string_to_slug(content.nomeCidade),
                tags: tags,
                caracteristicas: carac,
                conhecidaPor: content.conhecidaPor,
                descricao: content.descricao,
                amam: content.amam,
                reclamam: content.reclamam,
                frase1: content.frase1,
                razoes: razoes,
                fotoDestaque: "/uploads/" + uploads.fotoDestaque.name,
                imagem1: "/uploads/" + uploads.imagem1.name,
                imagem2: "/uploads/" + uploads.imagem2.name,
                imagem3: "/uploads/" + uploads.imagem3.name,
                status: "publicado",
                publicadoPor: user.name.first + " " + user.name.last
            }).save(function (err, docs) {
                if (err)
                    throw err
                res.redirect('/cidade/' + docs.slug);
            });
        }
    });

    app.post('/novoBairro', function (req, res) {
        var user = req.user;
        var uploads = req.files;
        var content = req.body;

        var tags = content.tags.split(',');

        var razoes = [{ razao: content.razao1, iconerazao: content.iconerazao1, descricaorazao: content.descricaorazao1 }, { razao: content.razao2, iconerazao: content.iconerazao2, descricaorazao: content.descricaorazao2 }, { razao: content.razao3, iconerazao: content.iconerazao3, descricaorazao: content.descricaorazao3 }, { razao: content.razao4, iconerazao: content.iconerazao4, descricaorazao: content.descricaorazao4}];

        var depoimento = [{ nome: content.nomedepoimento1, imagem: "/uploads/" + uploads.imagemdepoimento1.name, texto: content.textodepoimento1 }, { nome: content.nomedepoimento2, imagem: "/uploads/" + uploads.imagemdepoimento2.name, texto: content.textodepoimento2}];

        var anuncio = [{ link: content.linkanuncio1, imagem: content.imagemanuncio1, tipo: content.tipoanuncio1 }, { link: content.linkanuncio2, imagem: content.imagemanuncio2, tipo: content.tipoanuncio2 }, { link: content.linkanuncio3, imagem: content.imagemanuncio3, tipo: content.tipoanuncio3}];

        var conhecida = content.conhecidaPor.split(',');
        console.log(content.caracteristicas)
        var carac = content.caracteristicas;

        if (!user) {
            res.redirect('/')
        } else {
            console.log(uploads.fotoDestaque.name)
            new Bairro({
                nomeBairro: content.nomeBairro,
                nomeCidade: content.nomeCidade,
                sigla: content.sigla,
                headline: content.headline,
                slug: func.string_to_slug(content.nomeBairro),
                tags: tags,
                caracteristicas: carac,
                conhecidaPor: content.conhecidaPor,
                descricao: content.descricao,
                amam: content.amam,
                reclamam: content.reclamam,
                frase1: content.frase1,
                frase2: content.frase2,
                frase3: content.frase3,
                frase4: content.frase4,
                razoes: razoes,
                anuncios: anuncio,
                fotoDestaque: "/uploads/" + uploads.fotoDestaque.name,
                imagem1: "/uploads/" + uploads.imagem1.name,
                imagem2: "/uploads/" + uploads.imagem2.name,
                imagem3: "/uploads/" + uploads.imagem3.name,
                imagem4: "/uploads/" + uploads.imagem4.name,
                imagem5: "/uploads/" + uploads.imagem5.name,
                imagem6: "/uploads/" + uploads.imagem6.name,
                imagem7: "/uploads/" + uploads.imagem7.name,
                imagem8: "/uploads/" + uploads.imagem8.name,
                imagem9: "/uploads/" + uploads.imagem9.name,
                imagem10: "/uploads/" + uploads.imagem10.name,
                imagem11: "/uploads/" + uploads.imagem11.name,
                imagem12: "/uploads/" + uploads.imagem12.name,
                imagem13: "/uploads/" + uploads.imagem13.name,
                imagem14: "/uploads/" + uploads.imagem14.name,
                depoimentos: depoimento,
                status: "publicado",
                publicadoPor: user.name.first + " " + user.name.last
            }).save(function (err, docs) {
                if (err)
                    throw err
                res.redirect('/bairro/' + docs.slug);
            });
        }
    });


    // PROFILE
    app.get('/perfil', function (req, res) {
        var user = req.user;

        if (!user || user.status != 'admin') {
            res.redirect('/');
        } else {
            res.render('profile', { title: "Bonsaits - Editar Perfil", user: user })
        }
    });

    // BLOG ALL
    app.get('/blog', function (req, res) {
        var user = req.user;

        Article.find({ status: 'publicado' }).limit(20).exec(function (err, docs) {
            for (i = 0; i < docs.length; i++) {
                var timeStamp = docs[i]._id.toString().substring(0, 8);
                var date = new Date(parseInt(timeStamp, 16) * 1000);
                docs[i].date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            }
            res.render('blog', { title: "Bonsaits - Blog", user: user, info: docs });
        });

    });

    //BLOG SINGLE
    app.get('/blog/:nome', function (req, res) {
        var user = req.user;

        Article.find({ slug: req.params.nome }).exec(function (err, docs) {
            docs[0].text = decodeURIComponent(docs[0].text);

            for (i = 0; i < docs.length; i++) {
                var timeStamp = docs[i]._id.toString().substring(0, 8);
                var date = new Date(parseInt(timeStamp, 16) * 1000);
                docs[i].date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            }

            Users.find({ _id: docs[0].author.main }).exec(function (err, us) {
                console.log(us);
                res.render('blogSingle', { title: "Bonsaits - " + docs[0].title, user: user, info: docs[0], single: true, author: us[0] });
            });


        });
    });

    // BLOG NEW
    app.get('/blog/criar/:type', function (req, res) {
        var user = req.user;

        if (!user || user.status != 'admin') {
            res.redirect('/');
        } else {
            new Article({
                'author.name': user.name.first + " " + user.name.last,
                'author.main': user._id,
                type: req.params.type
            }).save(function (err, docs) {
                if (err) throw err

                res.render('novo', { title: "Novo Post", user: user, id: docs._id, type: req.params.type, edit: false });
            });
        }
    });

    // BLOG EDIT
    app.get('/blog/:id/editar', function (req, res) {
        var user = req.user;

        if (!user || user.status != 'admin') {
            res.redirect('/');
        } else {
            Article.find({ id: req.params.slug }).exec(function (err, docs) {
                if (err) throw err
                docs[0].text = decodeURIComponent(docs[0].text);
                res.render('novo', { title: "Novo Post", user: user, id: docs[0]._id, type: docs[0].type, edit: true, info: docs[0] });
            });
        }
    });

    // SLUG CHECK
    app.get('/titleCheck/:id', function (req, res) {
        var user = req.user,
            id = req.params.id,
            check = req.query.check,
            title = req.query.title;
        slug = func.string_to_slug(decodeURIComponent(title.replace('<p>', '').replace('</p>', '')));
        console.log(check);
        console.log(slug);

        if (check == 'true') {
            Article.find({ _id: id }, function (err, docs) {
                if (docs[0].slug == slug) {
                    res.end('yes');
                } else {
                    Article.find({ slug: slug }, function (err, arts) {
                        if (arts.length > 0) {
                            res.end('no');
                        } else {
                            res.end('yes');
                        }
                    });
                }
            });
        } else {
            Article.find({ slug: slug }, function (err, arts) {
                if (arts.length > 0) {
                    res.end('no');
                } else {
                    res.end('yes');
                }
            });
        }
    });

    // UPLOAD DE IMAGENS DURANTE A CRIAÇÃO DE ARTIGOS
    app.post('/artigoImage', function (req, res, next) {
        var user = req.user;
        console.log('chegou até aqui 1')
        var sendImg = req.files.file.name;

        if (user.status == 'admin') {
            // get the temporary location of the file
            var tmp_path = req.files.file.path;
            // set where the file should actually exists - in this case it is in the "images" directory
            var target_path = './public/uploads/' + sendImg;
            // move the file from the temporary location to the intended location
            fs.rename(tmp_path, target_path, function (err) {
                if (err) throw err;
                // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
                fs.unlink(tmp_path, function () {
                    if (err) throw err;
                    console.log('chegou até aqui 2')
                    res.send({ "filelink": "/uploads/" + sendImg });
                });
            });

        } else {
            res.send("não deu")
            console.log("não deu")
        }

    });


    // SALVAR COVER IMAGE
    app.post('/coverImage', function (req, res) {
        var user = req.user;

        var sendImg = req.files.file.name;
        console.log('chegou até aqui 3')
        if (user.status == 'admin') {
            // get the temporary location of the file
            var tmp_path = req.files.file.path;
            // set where the file should actually exists - in this case it is in the "images" directory
            var target_path = './public/uploads/' + sendImg;
            // move the file from the temporary location to the intended location
            fs.rename(tmp_path, target_path, function (err) {
                if (err) throw err;
                // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
                fs.unlink(tmp_path, function () {
                    if (err) throw err;
                    console.log('chegou até aqui 4')
                    res.send(sendImg);
                });
            });

        } else {
            res.send("não deu")
            console.log("não deu")
        }

    });

    // SALVAR NOVO ARTIGO
    app.post('/novoArtigo/:id', function (req, res) {
        var user = req.user;
        var id = req.params.id;

        if (user.status == 'admin') {

            Article.update({ _id: id }, { $set: { text: req.body.content} }, function (err) {
                if (err)
                    throw err
                res.send(JSON.stringify(req.body));
            });
        } else {
            res.redirect('/parceiros');
        }
    });

    // SALVAR NOVO TITULO
    app.post('/novoTitulo/:id', function (req, res) {
        var user = req.user;
        var id = req.params.id;

        if (user.status == 'admin') {

            Article.update({ _id: id }, { $set: { title: decodeURIComponent(req.body.content).replace('<p>', '').replace('</p>', '')} }, function (err) {
                if (err)
                    throw err
                res.send(decodeURIComponent(req.body.content).replace('<p>', '').replace('</p>', ''));
            });

        } else {
            res.redirect('/parceiros');
        }
    });


    // PUBLICAR ARTIGO
    app.post('/novoArtigo', function (req, res) {
        var user = req.user,
			type = req.body.type,
			tags = req.body.tags,
			id = req.body.id,
			cover = req.body.cover,
			subtitle = req.body.subtitle,
			slug = func.string_to_slug(req.body.title);

        console.log(req.body.title);

        if (!user.status == 'admin') {
            res.redirect('/');
        } else {
            if (type == 'artigo') {
                var description = req.body.description;

                Article.update({ _id: id }, { $set: {
                    status: 'publicado',
                    tags: tags,
                    subtitle: subtitle,
                    slug: slug,
                    cover: cover,
                    description: description
                }
                }, function (err) {
                    if (err)
                        throw err
                    res.send('/blog/' + slug);
                });
            } else if (type == 'headline') {
                var headline = req.body.headline;

                Article.update({ _id: id }, { $set: {
                    status: 'publicado',
                    tags: tags,
                    subtitle: subtitle,
                    slug: slug,
                    cover: cover,
                    headline: headline
                }
                }, function (err) {
                    if (err)
                        throw err
                    res.send('/blog/' + slug);
                });
            } else if (type == 'link') {
                var link = req.body.link,
					description = req.body.description;

                Article.update({ _id: id }, { $set: {
                    status: 'publicado',
                    tags: tags,
                    subtitle: subtitle,
                    slug: slug,
                    cover: cover,
                    description: description,
                    link: link
                }
                }, function (err) {
                    if (err)
                        throw err
                    res.send('/blog/' + slug);
                });

            }
        }
    });

    // DELETAR ARTIGO
    app.post('/deletarArtigo', function (req, res) {
        var user = req.user,
            id = req.body.id;

        if (!user || user.status != 'admin') {
            res.redirect('/');
        } else {
            Article.remove({ _id: id }).exec(function (err) {
                if (err)
                    throw err
                res.send("OK");
            });
        }
    });


    // =====================================
    // USER SIGNUP =========================
    // ===================================== I should later find a way to pass params to the jade file here and put values on the inputs
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/registrar', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages     
    }));

    app.get('/registrar', function (req, res) {
        var user = req.user;
        if (!user) {
            res.render("signup", { title: "Bonsaits - Registrar", message: req.flash('signupMessage') });
        } else {
            res.redirect("/");
        }
    });



    // =====================================
    // LOG IN ==============================
    // =====================================
    app.get('/login', function (req, res) {
        var user = req.user;
        if (!user) {
            res.render("login", { message: req.flash('loginMessage') });
            if (req.url === '/favicon.ico') {
                r.writeHead(200, { 'Content-Type': 'image/x-icon' });
                return r.end();
            }
        } else {
            res.redirect("/");
        }
    });


    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_friends']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
	    passport.authenticate('facebook', {
	        successRedirect: '/facebook',
	        failureRedirect: '/'
	    })
    );

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
		    successRedirect: '/profile',
		    failureRedirect: '/'
		})
    );

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        })
    );


    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope: ['email', 'user_about_me',
    'user_birthday ', 'user_hometown', 'user_website']
    }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
			    successRedirect: '/facebook',
			    failureRedirect: '/'
			})
        );

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope: 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
			    successRedirect: '/profile',
			    failureRedirect: '/'
			})
        );


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email', 'openid'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
		passport.authorize('google', {
		    successRedirect: '/profile',
		    failureRedirect: '/'
		})
    );


    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // facebook -------------------------------
    app.get('/unlink/facebook', function (req, res) {
        var user = req.user;
        user.social.facebook.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });


    // ADD FACEBOOK FRIENDS
    app.get('/facebook', function (req, res) {
        var user = req.user;
        facebook.getFbData(user.social.facebook.token, '/me/friends', function (data) {
            var friend = eval("(" + data + ")")
            Users.update({ _id: user._id }, { $pushAll: { 'social.facebook.friends': friend.data} }, function (err) {
                res.redirect('/');
            });
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function (req, res) {
        var user = req.user;
        user.social.twitter.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function (req, res) {
        var user = req.user;
        user.social.google.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // =====================================
    // delete USER =========================
    // =====================================
    app.put('/users/delete', function (req, res) {
        Users.update(
            { 'name.loginName': req.user.name.loginName },
            { $set: {
                deleted: true
            }
            },
            function (err) {
                res.redirect('/logout')
            }
        );
    });

    // =====================================
    // RESTORE USER ========================
    // =====================================
    app.get('/users/restore', function (req, res) {
        user = req.user;
        res.render('profile/restore', { user: user });
    });

    app.put('/users/restore', function (req, res) {
        Users.update(
            { 'name.loginName': req.user.name.loginName },
            { $set: {
                deleted: false
            }
            },
            function (err) {
                res.redirect('/profile')
            }
        );
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

}