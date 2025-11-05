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

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setKeranjangs(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        localStorage.removeItem('cart');
      }
    }
  }, []);

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

  const fetchKeranjangs = () => {
    // Cart is now managed in localStorage, just read from state
    // This function is kept for compatibility with Hasil component
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setKeranjangs(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart:', e);
        setKeranjangs([]);
      }
    }
  };

  useEffect(() => {
    fetchProducts(categoriYangDipilih);
    // Don't need to fetch cart from API anymore, it's in localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeCategory = value => {
    setCategoriYangDipilih(value);
    // keep currently displayed menus until new results arrive; show loader
    fetchProducts(value);
  };

  const masukKeranjang = value => {
    try {
      console.log('[masukKeranjang] Adding product to cart:', value);
      
      // Get current cart from state
      const currentCart = [...keranjangs];
      
      // Check if product already in cart
      const existingIndex = currentCart.findIndex(item => item.product?.id === value.id);
      
      if (existingIndex >= 0) {
        // Update existing item quantity
        currentCart[existingIndex] = {
          ...currentCart[existingIndex],
          jumlah: currentCart[existingIndex].jumlah + 1,
          total_harga: (currentCart[existingIndex].jumlah + 1) * value.harga
        };
        
        console.log('[masukKeranjang] Updated existing item:', currentCart[existingIndex]);
      } else {
        // Add new item to cart with proper structure
        const newItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Temporary local ID
          product: {
            id: value.id,
            nama: value.nama,
            harga: value.harga,
            gambar: value.gambar,
            category: value.category
          },
          jumlah: 1,
          total_harga: value.harga,
          keterangan: ''
        };
        
        currentCart.push(newItem);
        console.log('[masukKeranjang] Added new item:', newItem);
      }
      
      // Update state and localStorage
      setKeranjangs(currentCart);
      localStorage.setItem('cart', JSON.stringify(currentCart));
      
      console.log('[masukKeranjang] Cart updated, total items:', currentCart.length);
      
      swal({ 
        title: 'Sukses Masuk Keranjang', 
        text: `${value.nama} ditambahkan ke keranjang`, 
        icon: 'success', 
        button: false, 
        timer: 1500 
      });
    } catch (err) {
      console.error('[masukKeranjang] Error:', err);
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

