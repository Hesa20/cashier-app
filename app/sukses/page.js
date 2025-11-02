"use client";
import React, { useEffect } from 'react';
import { Button, Image } from 'react-bootstrap';
import Link from 'next/link';
import api from '../../src/lib/api';

export default function SuksesPage() {
  useEffect(() => {
    // Clear cart after successful order
    api
      .get('keranjangs')
      .then(res => {
        const keranjangs = res.data;
        const deletePromises = keranjangs.map(item => 
          api.delete(`keranjangs/${item.id}`)
        );
        return Promise.all(deletePromises);
      })
      .catch(err => {
        console.error('Error clearing cart:', err);
        // Silent error - cart cleanup is not critical for success page
      });
  }, []);

  return (
    <div className="mt-5 text-center">
      <Image
        src="/assets/images/success.png"
        className="success-img"
        width="500px"
        alt="Success"
      />
      <h2 style={{ marginTop: '20px', fontWeight: 'bold' }}>Pesanan Berhasil</h2>
      <h5>Terimakasih Sudah Memesan!</h5>
      <Button
        as={Link}
        href="/"
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
