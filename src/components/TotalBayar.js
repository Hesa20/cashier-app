"use client";

import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../lib/api';
import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { numberWithCommas } from '../utils/utils';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';

export default function TotalBayar({ keranjangs }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const submitTotalBayar = async (totalBayar) => {
    if (keranjangs.length === 0) {
      swal({
        title: 'Keranjang Kosong',
        text: 'Silakan pilih produk terlebih dahulu',
        icon: 'warning',
        button: 'OK',
      });
      return;
    }

    setIsProcessing(true);

    // Transform keranjangs to items format expected by backend
    const items = keranjangs.map(item => ({
      productId: item.productId,
      jumlah: item.jumlah,
      harga: item.product.harga,
      totalHarga: item.totalHarga
    }));

    const pesanan = {
      items: items,
      totalHarga: totalBayar,
      metodePembayaran: 'cash' // Default to cash, can be made dynamic later
    };

    try {
      await api.post('pesanans', pesanan);
      router.push('/sukses');
    } catch (err) {
      console.error('Error submitting order', err);
      swal({
        title: 'Gagal Memproses Pesanan',
        text: 'Terjadi kesalahan saat memproses pesanan Anda',
        icon: 'error',
        button: 'OK',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const totalBayar = (keranjangs || []).reduce((result, item) => result + item.totalHarga, 0); // Changed from total_harga to totalHarga

  return (
    <>
      {/* Web */}
      <div className="fixed-bottom d-none d-md-block">
        <Row>
          <Col md={{ span: 3, offset: 9 }} className="px-4 mb-3">
            <h4>
              Total Harga :{' '}
              <strong className="float-right mr-2">Rp. {numberWithCommas(totalBayar)}</strong>
            </h4>
            <Button
              variant="primary"
              block
              className="mb-2 mt-3 mr-2"
              size="lg"
              style={{
                backgroundColor: '#47422e',
                border: 'none',
                padding: '12px 22px',
                borderRadius: '8px',
              }}
              onClick={() => submitTotalBayar(totalBayar)}
              disabled={isProcessing || keranjangs.length === 0}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <strong>Memproses...</strong>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faShoppingCart} /> <strong>BAYAR</strong>
                </>
              )}
            </Button>
          </Col>
        </Row>
      </div>

      {/* Mobile  */}
      <div className="d-sm-block d-md-none">
        <Row>
          <Col md={{ span: 3, offset: 9 }} className="px-4 mt-4">
            <h4>
              Total Harga :{' '}
              <strong className="float-right mr-2">Rp. {numberWithCommas(totalBayar)}</strong>
            </h4>
            <Button
              variant="primary"
              block
              className="mb-2 mt-4 mr-2 py-3 px-4"
              style={{ backgroundColor: '#47422e', border: 'none' }}
              size="lg"
              onClick={() => submitTotalBayar(totalBayar)}
              disabled={isProcessing || keranjangs.length === 0}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <strong>Memproses...</strong>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faShoppingCart} /> <strong>BAYAR</strong>
                </>
              )}
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
}
