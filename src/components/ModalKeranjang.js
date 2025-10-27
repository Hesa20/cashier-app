import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";

const ModalKeranjang = ({
  showModal,
  handleClose,
  keranjangDetail,
  jumlah,
  keterangan,
  tambah,
  kurang,
  changeHandler,
  handleSubmit,
  totalHarga,
  hapusPesanan,
}) => {
  if (keranjangDetail) {
    return (
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {keranjangDetail.product.nama}{" "}
            <strong>
              (Rp. {numberWithCommas(keranjangDetail.product.harga)})
            </strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Total Harga :</Form.Label>
              <p>
                <strong>Rp. {numberWithCommas(totalHarga)}</strong>
              </p>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Jumlah :</Form.Label>
              <br />
              <Button
                size="sm"
                className="mr-2"
                style={{
                  backgroundColor: "#47422e",
                  marginRight: "10px",
                  border: "none",
                }}
                onClick={() => kurang()}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>

              <strong>{jumlah}</strong>

              <Button
                variant="primary"
                size="sm"
                style={{
                  backgroundColor: "#47422e",
                  marginLeft: "10px",
                  border: "none",
                }}
                onClick={() => tambah()}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label style={{ marginTop: "20px" }}>
                Keterangan :
              </Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                name="keterangan"
                placeholder="Contoh : Pedes, Nasi Setengah"
                value={keterangan}
                onChange={(event) => changeHandler(event)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              style={{
                backgroundColor: "#47422e",
                border: "none",
                marginTop: "15px",
              }}
            >
              Simpan
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => hapusPesanan(keranjangDetail.id)}
          >
            <FontAwesomeIcon icon={faTrash} /> Hapus Pesanan
          </Button>
        </Modal.Footer>
      </Modal>
    );
  } else {
    return (
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Kosong</Modal.Title>
        </Modal.Header>
        <Modal.Body>Kosong</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
};

export default ModalKeranjang;
