import React, { useEffect, useState } from "react";
import { Button, TextInput, Popover, Modal } from "flowbite-react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [isFormValid, setIsFormValid] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      dispatch(signInSuccess(res.data.rest));
      navigate("/");
    } catch (error) {
      if (error.response) {
        dispatch(signInFailure(error.response.data.message));
      } else {
        dispatch(signInFailure("Something went wrong"));
      }
      setOpenModal(true);
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email.includes("@"))
      tempErrors.email = "Invalid email format";
    if (formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";

    setFormErrors(tempErrors);
    setIsFormValid(Object.keys(tempErrors).length === 0);
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5 mx-auto text-center">LogIn</h1>
      <form>
        <div className="flex flex-col gap-4">
          <Popover
            content={
              formErrors.email && (
                <span className="text-red-400 mx-2">{formErrors.email}</span>
              )
            }
            open={formErrors.email}
            placement="right"
          >
            <TextInput
              id="email"
              type="email"
              className="w-[300px] mx-auto"
              onChange={handleChange}
              value={formData.email}
              placeholder="Email"
              color={formErrors.email ? "failure" : ""}
            />
          </Popover>
          <Popover
            content={
              formErrors.password && (
                <span className="text-red-400 mx-2">{formErrors.password}</span>
              )
            }
            open={formErrors.password}
            placement="right"
          >
            <TextInput
              id="password"
              type="password"
              className="w-[300px] mx-auto"
              onChange={handleChange}
              value={formData.password}
              placeholder="Password"
              color={formErrors.password ? "failure" : ""}
            />
          </Popover>
          <div className="text-6xs mr-26">
            Forget Password?
            <Link to="/forget-password" className="text-blue-950">
              {" "}
              Click Here.
            </Link>
          </div>
        </div>
        <Button
          className="mx-auto mt-5 w-[300px] rounded-xl"
          outline
          gradientDuoTone="purpleToPink"
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          {loading ? "LogingIn..." : "LogIn"}
        </Button>
      </form>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>{error ? "Error" : "Success"}</Modal.Header>
        <Modal.Body>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-green-500">Account created successfully!</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Ok</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
