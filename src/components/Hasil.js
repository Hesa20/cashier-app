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
    setTotalHarga(menuKeranjang.totalHarga); // Changed from total_harga to totalHarga
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleClose();

    const data = {
      jumlah: parseInt(jumlah, 10), // Ensure it's sent as number
      totalHarga: parseInt(totalHarga, 10), // Ensure it's sent as number
      keterangan: keterangan || '', // Ensure it's a string
    };

    console.log('🔍 [DEBUG] Sending update data:', data);
    console.log('🔍 [DEBUG] Keranjang ID:', keranjangDetail.id);

    try {
      await api.put(`keranjangs/${keranjangDetail.id}`, data);
      
      // Refresh keranjang data setelah update berhasil
      await fetchKeranjangs();
      
      swal({
        title: 'Update Pesanan!',
        text: `Sukses Update Pesanan ${keranjangDetail.product.nama}`,
        icon: 'success',
        button: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      swal({
        title: 'Gagal Update!',
        text: 'Terjadi kesalahan saat mengupdate pesanan',
        icon: 'error',
        button: 'OK',
      });
    }
  };

  const hapusPesanan = async (id) => {
    handleClose();

    try {
      await api.delete(`keranjangs/${id}`);
      
      // Refresh keranjang data setelah delete berhasil
      await fetchKeranjangs();
      
      swal({
        title: 'Hapus Pesanan!',
        text: `Sukses Hapus Pesanan ${keranjangDetail.product.nama}`,
        icon: 'error',
        button: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error deleting cart item:', error);
      swal({
        title: 'Gagal Hapus!',
        text: 'Terjadi kesalahan saat menghapus pesanan',
        icon: 'error',
        button: 'OK',
      });
    }
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
                      Rp. {numberWithCommas(menuKeranjang.totalHarga)}
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
