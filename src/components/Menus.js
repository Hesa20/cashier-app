import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { numberWithCommas } from '../utils/utils';

const Menus = ({ menu, masukKeranjang }) => {
  const categoryName = menu.category?.nama?.toLowerCase() || 'makanan';
  const imagePath = `/assets/images/${categoryName}/${menu.gambar}`;

  return (
    <Col md={4} xs={6} className="mb-4">
      <Card
        className="shadow-sm lighter-clr product-card"
        style={{ cursor: 'pointer', borderRadius: '15px', border: 'none', overflow: 'hidden' }}
        onClick={() => masukKeranjang(menu)}
      >
        <div className="product-image-wrapper">
          <Card.Img
            variant="top"
            src={imagePath}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/images/default.png';
            }}
            alt={menu.nama}
            className="product-image"
          />
        </div>
        <Card.Body className="product-card-body">
          <Card.Title className="product-title">
            {menu.nama} <strong>({menu.kode})</strong>
          </Card.Title>
          <Card.Text className="product-price">Rp. {numberWithCommas(menu.harga)}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Menus;
