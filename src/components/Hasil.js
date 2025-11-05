"use client";

import React, { useState } from 'react';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import { numberWithCommas } from '../utils/utils';
import ModalKeranjang from './ModalKeranjang';
import TotalBayar from './TotalBayar';
import api from '../lib/api';
import swal from 'sweetalert';

export default function Hasil({ keranjangs, fetchKeranjangs }) {
  const [showModal, setShowModal] = useState(false);
  const [keranjangDetail, setKeranjangDetail] = useState(null);
  const [jumlah, setJumlah] = useState(0);
  const [keterangan, setKeterangan] = useState('');
  const [totalHarga, setTotalHarga] = useState(0);

  const handleShow = (menuKeranjang) => {
    setShowModal(true);
    setKeranjangDetail(menuKeranjang);
    setJumlah(menuKeranjang.jumlah);
    setKeterangan(menuKeranjang.keterangan || '');
    setTotalHarga(menuKeranjang.total_harga); // Use total_harga from cart item
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const tambah = () => {
    const newJumlah = jumlah + 1;
    setJumlah(newJumlah);
    setTotalHarga(keranjangDetail.product.harga * newJumlah);
  };

  const kurang = () => {
    if (jumlah > 1) {
      const newJumlah = jumlah - 1;
      setJumlah(newJumlah);
      setTotalHarga(keranjangDetail.product.harga * newJumlah);
    }
  };

  const changeHandler = (event) => {
    setKeterangan(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleClose();

    // Update cart in localStorage
    const updatedCart = keranjangs.map(item => {
      if (item.id === keranjangDetail.id) {
        return {
          ...item,
          jumlah: parseInt(jumlah, 10),
          total_harga: parseInt(totalHarga, 10),
          keterangan: keterangan || ''
        };
      }
      return item;
    });

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Refresh cart display
    fetchKeranjangs();
    
    swal({
      title: 'Update Pesanan!',
      text: `Sukses Update Pesanan ${keranjangDetail.product.nama}`,
      icon: 'success',
      button: false,
      timer: 1500,
    });
  };

  const hapusPesanan = (id) => {
    handleClose();

    // Remove item from cart
    const updatedCart = keranjangs.filter(item => item.id !== id);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Refresh cart display
    fetchKeranjangs();
    
    swal({
      title: 'Hapus Pesanan!',
      text: `Sukses Hapus Pesanan ${keranjangDetail.product.nama}`,
      icon: 'error',
      button: false,
      timer: 1500,
    });
  };

  return (
    <Col md={3} className="mt-3">
      <h4>
        <strong>Hasil</strong>
      </h4>
      <hr />
      {keranjangs.length !== 0 && (
        <Card
          className="overflow-auto hasil lighter-clr"
          style={{ height: '55vh', paddingTop: '7px' }}
        >
          <ListGroup variant="flush">
            {keranjangs.map((menuKeranjang) => (
              <ListGroup.Item
                key={menuKeranjang.id}
                onClick={() => handleShow(menuKeranjang)}
                className="lighter-clr"
              >
                <Row className="lighter-clr" style={{ cursor: 'pointer', marginTop: '7px' }}>
                  <Col xs={2}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '35px',
                        height: '35px',
                        backgroundColor: '#756f52',
                        color: 'white',
                        borderRadius: '999px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      {menuKeranjang.jumlah}
                    </div>
                  </Col>
                  <Col>
                    <h5>{menuKeranjang.product.nama}</h5>
                    <p>Rp. {numberWithCommas(menuKeranjang.product.harga)}</p>
                  </Col>
                  <Col>
                    <strong className="float-right">
                      Rp. {numberWithCommas(menuKeranjang.total_harga)}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}

            <ModalKeranjang
              handleClose={handleClose}
              showModal={showModal}
              keranjangDetail={keranjangDetail}
              jumlah={jumlah}
              keterangan={keterangan}
              totalHarga={totalHarga}
              tambah={tambah}
              kurang={kurang}
              changeHandler={changeHandler}
              handleSubmit={handleSubmit}
              hapusPesanan={hapusPesanan}
            />
          </ListGroup>
        </Card>
      )}

      <TotalBayar keranjangs={keranjangs} />
    </Col>
  );
}
