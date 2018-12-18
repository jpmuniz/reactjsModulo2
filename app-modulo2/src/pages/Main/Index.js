import React, { Component } from "react";
import logo from "../../assests/logo.png";

import { Container, Form } from "./style";

import CompareList from "../../components/compareList/Index";

import api from "axios";

export default class Main extends Component {
  state = {
    repositoryInput: "",
    repositories: [],
    loading: false
  };

  handleAddrepository = async event => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    try {
      const response = await api.get(
        `https://api.github.com/repos/${this.state.repositoryInput}`
      );
      this.setState({
        repositoryInput: "",
        repositories: [...this.state.repositories, response.data]
      });
      console.log(response);
    } catch (err) {
      console.log(err);
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
        <Form onSubmit={this.handleAddrepository}>
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
