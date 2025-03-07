"use client";

import { useState } from "react";
import {
  Container,
  CssBaseline,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function Home() {
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    qty: "",
    price: "",
    discountPer: "",
    taxPer: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const calculateValues = (field, value) => {
    const data = { ...formData, [field]: value };
    const qty = parseFloat(data.qty) || 0;
    const price = parseFloat(data.price) || 0;
    const discountPer = parseFloat(data.discountPer) || 0;
    const taxPer = parseFloat(data.taxPer) || 0;

    const discount = (qty * price * discountPer) / 100;
    const tax = ((qty * price - discount) * taxPer) / 100;
    const totalPrice = qty * price - discount + tax;

    return { ...data, discount, tax, totalPrice };
  };

  const handleChange = (e) => {
    setFormData(calculateValues(e.target.name, e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedInvoices = [...invoices];
      updatedInvoices[editingIndex] = formData;
      setInvoices(updatedInvoices);
      setEditingIndex(null);
    } else {
      setInvoices([...invoices, formData]);
    }
    setFormData({ qty: "", price: "", discountPer: "", taxPer: "" });
  };

  const handleEdit = (index) => {
    setFormData(invoices[index]);
    setEditingIndex(index);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
          label="Dark Mode"
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Invoice Form
        </Typography>
        <form onSubmit={handleSubmit}>
          {["qty", "price", "discountPer", "taxPer"].map((field) => (
            <TextField
              key={field}
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              label={field.replace(/([A-Z])/g, " $1").trim()}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          ))}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {editingIndex !== null ? "Update" : "Submit"}
          </Button>
        </form>
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Qty",
                  "Price",
                  "Discount %",
                  "Discount",
                  "Tax %",
                  "Tax",
                  "Total Price",
                  "Actions",
                ].map((head) => (
                  <TableCell key={head}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice, index) => (
                <TableRow key={index}>
                  {Object.values(invoice).map((val, i) => (
                    <TableCell key={i}>{val}</TableCell>
                  ))}
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
}