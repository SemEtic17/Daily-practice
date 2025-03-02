import React, { useEffect, useState } from "react";
import { Button, TextInput, Popover, Modal } from "flowbite-react";
import api from "../utils/api";

export default function ForgetPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", formData);
      console.log(res.data);
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.message);
      } else {
        setErrors("Something went wrong");
      }
      setOpenModal(true);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email.includes("@"))
      tempErrors.email = "Invalid email format";

    setErrors(tempErrors);
    setIsFormValid(Object.keys(tempErrors).length === 0);
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5 mx-auto text-center">
        Forgot Password
      </h1>
      <form>
        <div className="flex flex-col gap-4">
          <Popover
            content={
              errors.email && (
                <span className="text-red-400 mx-2">{errors.email}</span>
              )
            }
            open={errors.email}
            placement="right"
          >
            <TextInput
              id="email"
              type="email"
              className="w-[300px] mx-auto"
              onChange={handleChange}
              value={formData.email}
              placeholder="Email"
              color={errors.email ? "failure" : ""}
            />
          </Popover>
        </div>
        <Button
          className="mx-auto mt-5 w-[300px] rounded-xl"
          outline
          gradientDuoTone="purpleToPink"
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          {loading ? "Sending Email" : "Send Email"}
        </Button>
      </form>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>{errors ? "Error" : "Success"}</Modal.Header>
        <Modal.Body>
          {errors ? (
            <p className="text-red-500">{errors}</p>
          ) : (
            <p className="text-green-500">Reset link sent to email!</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Ok</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
