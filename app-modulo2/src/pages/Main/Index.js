import React, { Component } from "react";
import logo from "../../assests/logo.png";
import moment from "moment";
import { Container, Form } from "./style";

import CompareList from "../../components/compareList/Index";

import api from "axios";

export default class Main extends Component {
  state = {
    repositoryInput: "",
    repositories: [],
    loading: false,
    repositoryError: false
  };

  componentDidMount = () => {
    console.log("tamanho", localStorage.length);
    for (let n = 0; n < localStorage.length; n++) {
      let nameRepo = localStorage.key(n);
      let parseJson = JSON.parse(localStorage.getItem(nameRepo));
      console.log(parseJson);
      this.setState({
        repositories: [parseJson, ...this.state.repositories]
      });
    }
  };

  handleAddrepository = async event => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    try {
      const { data: respository } = await api.get(
        `https://api.github.com/repos/${this.state.repositoryInput}`
      );

      respository.lastCommit = moment(respository.pushed_at).fromNow();

      localStorage.setItem(respository.name, JSON.stringify({ respository }));
      console.log(respository);
      this.setState({
        repositoryInput: "",
        repositories: [...this.state.repositories, respository],
        repositoryError: false
      });
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({
        loading: false
      });
    }
  };

  render() {
    return (
      <Container>
        <img src={logo} alt="Git compare" />
        <Form
          withError={this.state.repositoryError}
          onSubmit={this.handleAddrepository}
        >
          <input
            type="text"
            placeholder="usuário/repositório"
            value={this.state.repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">
            {this.state.loading ? (
              <i className="fa fa-spinner fa-pulse" />
            ) : (
              "OK"
            )}
          </button>
        </Form>
        <CompareList repositories={this.state.repositories} />
      </Container>
    );
  }
}
