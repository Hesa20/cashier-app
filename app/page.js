"use client";
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Hasil, ListCategories, Menus } from '../src/components';
import api from '../src/lib/api';
import swal from 'sweetalert';

export default function Page() {
  const [menus, setMenus] = useState([]);
  const [categoriYangDipilih, setCategoriYangDipilih] = useState('Makanan');
  const [keranjangs, setKeranjangs] = useState([]);

  const fetchProducts = category => {
    api
      .get(`products?category.nama=${category}`)
      .then(res => setMenus(res.data))
      .catch(err => console.error(err));
  };

  const fetchKeranjangs = () => {
    api
      .get('keranjangs')
      .then(res => setKeranjangs(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts(categoriYangDipilih);
    fetchKeranjangs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // refetch keranjangs when changed (simple approach)
    fetchKeranjangs();
  }, [keranjangs.length]);

  const changeCategory = value => {
    setCategoriYangDipilih(value);
    setMenus([]);
    fetchProducts(value);
  };

  const masukKeranjang = value => {
    api
      .get(`keranjangs?product.id=${value.id}`)
      .then(res => {
        if (res.data.length === 0) {
          const keranjang = { jumlah: 1, total_harga: value.harga, product: value };
          api
            .post('keranjangs', keranjang)
            .then(() => {
              swal({ title: 'Sukses Masuk Keranjang', text: `Sukses Masuk Keranjang ${keranjang.product.nama}`, icon: 'success', button: false, timer: 1500 });
              fetchKeranjangs();
            })
            .catch(err => console.error(err));
        } else {
          const keranjang = { jumlah: res.data[0].jumlah + 1, total_harga: res.data[0].total_harga + value.harga, product: value };
          api
            .put(`keranjangs/${res.data[0].id}`, keranjang)
            .then(() => {
              swal({ title: 'Sukses Masuk Keranjang', text: `Sukses Masuk Keranjang ${keranjang.product.nama}`, icon: 'success', button: false, timer: 1500 });
              fetchKeranjangs();
            })
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="mt-3 mb-5">
      <Container fluid>
        <Row>
          <ListCategories changeCategory={changeCategory} categoriYangDipilih={categoriYangDipilih} />
          <Col className="mt-3">
            <h4>
              <strong>Daftar Produk</strong>
            </h4>
            {process.env.NODE_ENV !== 'production' && (
              <div style={{ marginBottom: '8px' }}>
                <small className="text-muted">Debug: categories loaded, products: {menus ? menus.length : 0}</small>
              </div>
            )}
            <hr />
            <Row className="overflow-auto menu" style={{ height: '690px' }}>
              {menus && menus.map(menu => <Menus key={menu.id} menu={menu} masukKeranjang={masukKeranjang} />)}
            </Row>
          </Col>
          <Hasil keranjangs={keranjangs} />
        </Row>
      </Container>
    </div>
  );
}

