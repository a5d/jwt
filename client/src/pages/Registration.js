import React, {Component} from 'react'
import {Link} from "react-router-dom";

class RegistrationPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      'complete': false,
      'email': '',
      'password': ''
    }

    this.submitForm = this.submitForm.bind(this)
    this.updateInput = this.updateInput.bind(this)
  }

  updateInput(e) {
    this.setState({[e.currentTarget.name]: e.currentTarget.value})
  }

  submitForm(e) {
    e.preventDefault()

    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      }),
      headers: {'content-type': 'application/json'}
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          this.setState({...data})
        } else {
          this.setState({auth: true})
          this.props.onLogged()
        }

      })
      .catch(e => console.error(e));
  }

  render() {
    const {email, password, complete} = this.state
    const {auth} = this.props

    if (complete === true) {
      return <p>Регистрация завершена</p>
    }

    if (auth === true) {
      return <p>Вы уже зарегистрированы</p>

    }

    return <div>
      <p>Registration Page</p>
      <form onSubmit={this.submitForm}>
        <p>
          <input
            name='email'
            onChange={this.updateInput}
            placeholder='E-mail'
            type="text"
            value={email}
          />
        </p>
        <p><input
          name='password'
          onChange={this.updateInput}
          placeholder='Пароль'
          type="password"
          value={password}
        /></p>
        <p>
          <button type="submit">Отправить</button>
        </p>
      </form>
    </div>
  }
}

export default RegistrationPage