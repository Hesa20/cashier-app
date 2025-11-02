"use client";
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Hasil, ListCategories, Menus } from '@/src/components';
import api from '@/src/lib/api';
import swal from 'sweetalert';

export default function Page() {
  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [categoriYangDipilih, setCategoriYangDipilih] = useState('Makanan');
  const [keranjangs, setKeranjangs] = useState([]);

  const fetchProducts = async category => {
    setLoadingMenus(true);
    
    try {
      console.log('[fetchProducts] Starting fetch for category:', category);
      
      // Find category ID first
      const categoriesResponse = await api.get('categories');
      console.log('[fetchProducts] Categories response:', categoriesResponse.data);
      const categories = categoriesResponse.data;
      const selectedCategory = categories.find(c => c.nama === category);
      
      console.log('[fetchProducts] Selected category:', selectedCategory);
      
      // Fetch products by category
      let productsResponse;
      if (selectedCategory) {
        productsResponse = await api.get(`products?categoryId=${selectedCategory.id}`);
      } else {
        productsResponse = await api.get('products');
      }
      
      console.log('[fetchProducts] Products response:', productsResponse.data?.length, 'products');
      setMenus(productsResponse.data);
    } catch (err) {
      console.error('[fetchProducts] Error:', err);
      swal({
        title: 'Gagal Memuat Produk',
        text: 'Terjadi kesalahan saat memuat daftar produk',
        icon: 'error',
        button: 'OK',
      });
    } finally {
      setLoadingMenus(false);
    }
  };

  const fetchKeranjangs = async () => {
    try {
      const response = await api.get('keranjangs');
      setKeranjangs(response.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      // Silent error for cart fetch, as it's not critical for initial page load
    }
  };

  useEffect(() => {
    fetchProducts(categoriYangDipilih);
    fetchKeranjangs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeCategory = value => {
    setCategoriYangDipilih(value);
    // keep currently displayed menus until new results arrive; show loader
    fetchProducts(value);
  };

  const masukKeranjang = async value => {
    try {
      // Check if product already in cart
      const checkResponse = await api.get(`keranjangs?productId=${value.id}`);
      const existingItems = checkResponse.data;
      
      if (existingItems.length === 0) {
        // Add new item to cart
        const keranjang = { 
          productId: value.id,
          jumlah: 1, 
          totalHarga: value.harga
        };
        
        await api.post('keranjangs', keranjang);
        swal({ 
          title: 'Sukses Masuk Keranjang', 
          text: `${value.nama} ditambahkan ke keranjang`, 
          icon: 'success', 
          button: false, 
          timer: 1500 
        });
      } else {
        // Update existing item quantity
        const existingItem = existingItems[0];
        const keranjang = { 
          productId: value.id,
          jumlah: existingItem.jumlah + 1, 
          totalHarga: existingItem.totalHarga + value.harga
        };
        
        await api.put(`keranjangs/${existingItem.id}`, keranjang);
        swal({ 
          title: 'Sukses Masuk Keranjang', 
          text: `${value.nama} ditambahkan ke keranjang`, 
          icon: 'success', 
          button: false, 
          timer: 1500 
        });
      }
      
      // Refresh cart
      await fetchKeranjangs();
    } catch (err) {
      console.error('Error with cart operation:', err);
      swal({
        title: 'Gagal',
        text: 'Terjadi kesalahan saat menambahkan ke keranjang',
        icon: 'error',
        button: 'OK',
      });
    }
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
            <hr />
            <Row className="overflow-auto menu" style={{ height: '690px' }}>
              {loadingMenus ? (
                <div className="text-center w-100 py-5">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : menus && menus.length > 0 ? (
                menus.map(menu => <Menus key={menu.id} menu={menu} masukKeranjang={masukKeranjang} />)
              ) : (
                <div className="text-muted px-3">Tidak ada produk pada kategori ini.</div>
              )}
            </Row>
          </Col>
          <Hasil keranjangs={keranjangs} fetchKeranjangs={fetchKeranjangs} />
        </Row>
      </Container>
    </div>
  );
}

