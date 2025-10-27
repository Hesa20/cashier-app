import React, { Component } from 'react';
import { Col, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faCoffee, faCheese } from '@fortawesome/free-solid-svg-icons';

const Icon = ({ nama }) => {
  switch (nama) {
    case 'Makanan':
      return <FontAwesomeIcon icon={faUtensils} className="me-2 black" />;
    case 'Minuman':
      return <FontAwesomeIcon icon={faCoffee} className="me-2 black" />;
    case 'Cemilan':
      return <FontAwesomeIcon icon={faCheese} className="me-2 black" />;
    default:
      return <FontAwesomeIcon icon={faUtensils} className="me-2" />;
  }
};

export default class ListCategories extends Component {
  state = {
    categories: [],
  };

  componentDidMount() {
    axios
      .get(API_URL + 'categories')
      .then(res => {
        this.setState({ categories: res.data });
      })
      .catch(error => {
        console.error('Error yaa ', error);
      });
  }

  render() {
    const { categories } = this.state;
    const { changeCategory, categoriYangDipilih } = this.props;

    return (
      <Col md={2} className="mt-3">
        <h4 className="fw-bold text-center mb-3" style={{ letterSpacing: 0 }}>
          List Kategori
        </h4>
        <hr className="mb-3" />
        <ListGroup variant="flush" style={{ marginLeft: '5px' }}>
          {categories.map(category => (
            <ListGroup.Item
              key={category.id}
              onClick={() => changeCategory(category.nama)}
              className={`d-flex align-items-center py-3 px-3 mb-2 rounded border-0 ${
                categoriYangDipilih === category.nama
                  ? 'active-clr text-white category-aktif'
                  : 'normal-clr'
              }`}
              style={{ cursor: 'pointer', transition: 'background 0.2s' }}
            >
              <Icon nama={category.nama} />
              <span className="ms-1" style={{ fontSize: '18px', marginLeft: '50px' }}>
                {category.nama}
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
    );
  }
}
