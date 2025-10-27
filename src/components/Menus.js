import React from "react";
import { Col, Card } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";

const Menus = ({ menu, masukKeranjang }) => {
  return (
    <Col md={4} xs={6} className="mb-4" style={{ height: "300px" }}>
      <Card className="shadow-sm lighter-clr" style={{ height: "300px", cursor: "pointer", borderRadius: "15px", border: "none" }} onClick={() => masukKeranjang(menu)}>
        <Card.Img
          variant="top"
          height={"180px"}
          style={{ objectFit: "cover", borderRadius: "15px 15px 0 0" }}
          src={
            "assets/images/" +
            menu.category.nama.toLowerCase() +
            "/" +
            menu.gambar
          }
        />
        <Card.Body>
          <Card.Title>{menu.nama} <strong>({menu.kode})</strong></Card.Title>
          <Card.Text>Rp. {numberWithCommas(menu.harga)}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Menus;
