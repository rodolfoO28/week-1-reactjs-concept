import React, { useState, useEffect } from "react";

import api from "./services/api";

import "./styles.css";

function App() {
  const [repository, setRepository] = useState({ title: '', url: '', techs: ''});
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  function handleNameRepository(e) {
    const title = e.target.value;

    setRepository({...repository, title});
  }

  function handleUrlRepository(e) {
    const url = e.target.value;

    setRepository({...repository, url});
  }

  function handleTechsRepository(e) {
    const techs = e.target.value.split(',');

    setRepository({...repository, techs});
  }

  async function handleAddRepository() {
    const { title, url, techs } = repository;
    
    const response = await api.post('repositories', { title, url, techs });

    const repo = response.data;

    setRepositories([...repositories, repo]);
    setRepository({ title: '', url: '', techs: ''});

    // console.log('Repositório cadastrado com sucesso!');
  }

  async function handleRemoveRepository(id) {
    try {
      const url = `repositories/${id}`;
      
      await api.delete(url);

      const repo = repositories.filter(repository => repository.id !== id);

      setRepositories(repo);

      // console.log('Repositório removido com sucesso!');
    } catch (e) {
      const { error } = e.response.data;
      console.log(error);
    }
  }

  return (
    <div>
      {repositories.length === 0 && <h1>Nenhum repositório encontrado!</h1>}
      <ul data-testid="repository-list">
        {repositories.map(repository =>
          <li key={repository.id} >
            {repository.title}

            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>  
        )}
      </ul>

      <div>
        <input type="text" placeholder="Nome do Repositório" value={repository.title} onChange={handleNameRepository} />
        <br/>
        <br/>
        <input type="text" placeholder="Url do Repositório" value={repository.url} onChange={handleUrlRepository} />
        <br/>
        <br/>
        <input type="text" placeholder="Tecnologias do Repositório" value={repository.techs} onChange={handleTechsRepository} />
        <small> ( separe por "," para informar mais de um) </small>
        <br/>
        <button onClick={handleAddRepository}>Adicionar</button>
      </div>
    </div>
  );
}

export default App;
