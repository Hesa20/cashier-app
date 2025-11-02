"use client";

import React, { useEffect, useState } from 'react';
import { Col, ListGroup } from 'react-bootstrap';
import api from '../lib/api';
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

export default function ListCategories({ changeCategory, categoriYangDipilih }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('categories')
      .then((res) => setCategories(res.data))
      .catch((error) => {
        console.error('Failed to load categories', error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Col md={2} className="mt-3">
      <h4 className="fw-bold text-center mb-3" style={{ letterSpacing: 0 }}>
        List Kategori
      </h4>
      <hr className="mb-3" />
      <ListGroup variant="flush" style={{ marginLeft: '5px' }}>
        {loading ? (
          <div className="px-3">
            <div
              className="spinner-border text-secondary"
              role="status"
              style={{ width: '1.25rem', height: '1.25rem' }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2 text-muted">Memuat kategori...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-muted px-3">Tidak ada kategori.</div>
        ) : (
          categories.map((category) => (
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
              <span className="ms-1" style={{ fontSize: '18px', marginLeft: '8px' }}>
                {category.nama}
              </span>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Col>
  );
}
