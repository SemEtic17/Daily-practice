import React, { useEffect, useState } from "react";
import { Button, TextInput, Popover, Modal } from "flowbite-react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    token: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    if (fetchedToken) {
      setFormData((prev) => ({ ...prev, token: fetchedToken }));
    } else {
      setErrors("Invalid or expired reset link.");
      setOpenModal(true);
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.token) {
      setErrors("Invalid or expired reset link.");
      setOpenModal(true);
      return;
    }

    try {
      const res = await api.post("/auth/reset-password", formData);
      console.log(res.data);
      navigate("/login");
    } catch (error) {
      setErrors(error.response?.data?.message || "Something went wrong");
      setOpenModal(true);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (formData.newPassword.length < 6)
      tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    setIsFormValid(Object.keys(tempErrors).length === 0);
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5 mx-auto text-center">
        Reset Password
      </h1>
      <form>
        <div className="flex flex-col gap-4">
          <Popover
            content={
              errors.password && (
                <span className="text-red-400 mx-2">{errors.password}</span>
              )
            }
            open={errors.password}
            placement="right"
          >
            <TextInput
              id="newPassword"
              type="password"
              className="w-[300px] mx-auto"
              onChange={handleChange}
              value={formData.newPassword}
              placeholder="Enter your new password"
              color={errors.password ? "failure" : ""}
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
          {loading ? "Reseting password..." : "Reset password"}
        </Button>
      </form>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>{errors ? "Error" : "Success"}</Modal.Header>
        <Modal.Body>
          {errors ? (
            <p className="text-red-500">{errors}</p>
          ) : (
            <p className="text-green-500">Password successfuly reseted!</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Ok</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
