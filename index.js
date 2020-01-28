const express = require('express');

const server = express();

server.use(express.json()); //plugin para ler json

const projects = [];

/*
 * Middleware checagem se projeto existe 
 */

function checkProjectExists( req, res, next ){
    const { id }= req.params;

    const project = projects.find(p => p.id == id);//busca projeto pelo id

    if(!project){
        return res.status(400).json({ error: 'Project not found' });
    }

    return next();
}

/*
 * Middleware log numero de requisições 
 */

function logRequests(req, res, next) {

    console.count("Número de requisições");//conta as requisições
  
    return next();
}

//chama o middleware global
server.use(logRequests);

//listagem de projetos
server.get('/projects/', (req, res) =>{     
    return res.json(projects)
});

//criar novo projeto
server.post('/projects/', (req, res) =>{
    const  { id, title }  = req.body;
    const project = {
        id,
        title,
        tasks : []
    }

    projects.push(project);

    return res.json(project);
});

//editar projeto
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);
});

//deletar projetos
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);//busca o indice do id

    projects.splice(projectIndex, 1);

    return res.send();

});

//criar tarefa no projeto
server.post('/projects/:id/tasks/', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);
});


server.listen(3000);