require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB conectado com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar no MongoDB:", error.message);
  });

const projectSchema = new mongoose.Schema({
  id: Number,
  nome: String,
  descricao: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const teamSchema = new mongoose.Schema({
  id: Number,
  nome: String,
  membros: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const taskSchema = new mongoose.Schema({
  id: Number,
  titulo: String,
  status: {
    type: String,
    default: "pendente"
  },
  responsavel: String,
  projetoId: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model("Project", projectSchema);
const Team = mongoose.model("Team", teamSchema);
const Task = mongoose.model("Task", taskSchema);

async function getNextId(Model) {
  const lastItem = await Model.findOne().sort({ id: -1 });
  return lastItem ? lastItem.id + 1 : 1;
}

app.get("/", (req, res) => {
  res.json({
    mensagem: "TaskFlow API funcionando!"
  });
});

// PROJETOS

app.post("/projects", async (req, res) => {
  try {
    const projeto = await Project.create({
      id: await getNextId(Project),
      nome: req.body.nome,
      descricao: req.body.descricao
    });

    res.status(201).json({
      mensagem: "Projeto criado com sucesso!",
      projeto
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao criar projeto",
      erro: error.message
    });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const projetos = await Project.find().sort({ id: 1 });
    res.json(projetos);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao listar projetos",
      erro: error.message
    });
  }
});

app.get("/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const projeto = await Project.findOne({ id });

    if (!projeto) {
      return res.status(404).json({
        mensagem: "Projeto não encontrado"
      });
    }

    res.json(projeto);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar projeto",
      erro: error.message
    });
  }
});

app.put("/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const projeto = await Project.findOneAndUpdate(
      { id },
      {
        nome: req.body.nome,
        descricao: req.body.descricao
      },
      { new: true }
    );

    if (!projeto) {
      return res.status(404).json({
        mensagem: "Projeto não encontrado"
      });
    }

    res.json({
      mensagem: "Projeto atualizado com sucesso!",
      projeto
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao atualizar projeto",
      erro: error.message
    });
  }
});

app.delete("/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const projeto = await Project.findOneAndDelete({ id });

    if (!projeto) {
      return res.status(404).json({
        mensagem: "Projeto não encontrado"
      });
    }

    res.json({
      mensagem: "Projeto excluído com sucesso!"
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao excluir projeto",
      erro: error.message
    });
  }
});

// EQUIPES

app.post("/teams", async (req, res) => {
  try {
    const equipe = await Team.create({
      id: await getNextId(Team),
      nome: req.body.nome,
      membros: req.body.membros || []
    });

    res.status(201).json({
      mensagem: "Equipe criada com sucesso!",
      equipe
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao criar equipe",
      erro: error.message
    });
  }
});

app.get("/teams", async (req, res) => {
  try {
    const equipes = await Team.find().sort({ id: 1 });
    res.json(equipes);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao listar equipes",
      erro: error.message
    });
  }
});

// TAREFAS

app.post("/tasks", async (req, res) => {
  try {
    const tarefa = await Task.create({
      id: await getNextId(Task),
      titulo: req.body.titulo,
      status: req.body.status || "pendente",
      responsavel: req.body.responsavel,
      projetoId: req.body.projetoId
    });

    res.status(201).json({
      mensagem: "Tarefa criada com sucesso!",
      tarefa
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao criar tarefa",
      erro: error.message
    });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tarefas = await Task.find().sort({ id: 1 });
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao listar tarefas",
      erro: error.message
    });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const tarefa = await Task.findOneAndUpdate(
      { id },
      {
        titulo: req.body.titulo,
        status: req.body.status,
        responsavel: req.body.responsavel,
        projetoId: req.body.projetoId
      },
      { new: true }
    );

    if (!tarefa) {
      return res.status(404).json({
        mensagem: "Tarefa não encontrada"
      });
    }

    res.json({
      mensagem: "Tarefa atualizada com sucesso!",
      tarefa
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao atualizar tarefa",
      erro: error.message
    });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const tarefa = await Task.findOneAndDelete({ id });

    if (!tarefa) {
      return res.status(404).json({
        mensagem: "Tarefa não encontrada"
      });
    }

    res.json({
      mensagem: "Tarefa excluída com sucesso!"
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao excluir tarefa",
      erro: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`TaskFlow rodando em http://localhost:${PORT}`);
});