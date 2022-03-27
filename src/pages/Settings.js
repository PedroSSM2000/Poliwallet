import { AttachMoney, LightModeRounded, Logout } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemIcon,
  MenuItem,
  Select,
} from "@mui/material";
import { currencies } from "constants";
import React, { useState } from "react";
import { deleteAllTransactions, logout } from "services";

export default function ProfileMenu() {
  const currentCurrency = "BRL";
  const [currency, setCurrency] = useState(currentCurrency);
  const handleCurrencyChange = e => setCurrency(e.target.value);
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return (
    <Box>
      <ListItem>
        <ListItemIcon>
          <AttachMoney />
        </ListItemIcon>
        Currency:
        <Select
          variant="standard"
          native
          onChange={handleCurrencyChange}
          value={currency}
        >
          {currencies.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Button onClick={openDialog}>Save</Button>
      </ListItem>

      <MenuItem>
        <ListItemIcon>
          <LightModeRounded />
        </ListItemIcon>
        Light theme
      </MenuItem>

      <MenuItem onClick={() => logout()}>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        Logout
      </MenuItem>

      <MenuItem onClick={() => deleteAllTransactions()}>
        Delete all transactions
      </MenuItem>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          Are you sure you want to change your currency?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have two options:
            <br />
            <strong>Convert</strong> all your past transactions to the new
            currency or <strong>delete</strong> all your transactions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={closeDialog} color="primary" autoFocus>
            Convert
          </Button>
          <Button onClick={closeDialog} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
