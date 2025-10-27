import React, { Component } from 'react';
import { Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constants';

export default class Sukses extends Component {
  componentDidMount() {
    axios
      .get(API_URL + 'keranjangs')
      .then(res => {
        const keranjangs = res.data;
        keranjangs.map(function (item) {
          return axios
            .delete(API_URL + 'keranjangs/' + item.id)
            .then(() => {})
            .catch(error => console.error(error));
        });
      })
      .catch(error => {
        console.error('Error yaa ', error);
      });
  }

  render() {
    return (
      <div className="mt-5 text-center">
        <Image
          src={process.env.PUBLIC_URL + '/assets/images/success.png'}
          className="success-img"
          width="500px"
        />
        <h2 style={{ marginTop: '20px', fontWeight: 'bold' }}>Pesanan Berhasil</h2>
        <h5>Terimakasih Sudah Memesan!</h5>
        <Button
          as={Link}
          to="/"
          className="px-4 py-2 mt-3"
          style={{
            border: 'none',
            fontSize: '17px',
            backgroundColor: '#47422e',
          }}
        >
          Kembali
        </Button>
      </div>
    );
  }
}
