import {
  AttachMoney,
  CardGiftcard,
  Checkroom,
  DevicesOther,
  DirectionsCar,
  EmojiEvents,
  House,
  LocalHospital,
  MoreHoriz,
  Payments,
  Restaurant,
  Savings,
  School,
  Sell,
  TheaterComedy,
  TrendingUp,
  Work,
  DeleteOutline,
  Edit,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteExpenseThunk, deleteIncomeThunk } from "../store/actions";
import ExpenseFormDrawer from "./ExpenseFormDrawer";
import IncomeFormDrawer from "./IncomeFormDrawer";

export const iconsMap = {
  Entertainment: <TheaterComedy />,
  Food: <Restaurant />,
  Health: <LocalHospital />,
  Education: <School />,
  Transportation: <DirectionsCar />,
  Savings: <Savings />,
  Payment: <Payments />,
  Clothing: <Checkroom />,
  Household: <House />,
  Eletronics: <DevicesOther />,
  Work: <Work />,
  Salary: <AttachMoney />,
  Investments: <TrendingUp />,
  Gift: <CardGiftcard />,
  Prize: <EmojiEvents />,
  Sale: <Sell />,
  Other: <MoreHoriz />,
};

export const colorMap = {
  Investments: "#22c55e",
  Payment: "#fbbf24",
  Food: "#fb923c",
  Work: "#3b82f6",
  Education: "#7dd3fc",
  Entertainment: "#ec4899",
  Transportation: "#6366f1",
  Eletronics: "#a3e635",
  Health: "#dc2626",
  Clothing: "#f43f5e",
  Household: "#a855f7",
  Other: "#d4d4d4",
  Salary: "#047857",
  Savings: "#2dd4bf",
  Gift: "#f87171",
  Prize: "#2196f3",
  Sale: "#d946ef",
};

export default function History() {
  const expenses = useSelector(state => state.filter.expenses);
  const incomes = useSelector(state => state.filter.incomes);

  if (expenses.length === 0 && incomes.length === 0) {
    return null;
  }

  const combinedTransactions = [...expenses, ...incomes];

  combinedTransactions.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexFlow: "column nowrap" }}>
      <Typography mb={1} ml={3.5} variant="h6">
        History
      </Typography>
      <List
        sx={{
          bgcolor: "background.paper",
          borderRadius: "1rem 1rem 0 0",
          boxShadow: 2,
          flexGrow: 1,
        }}
      >
        {combinedTransactions.map(transaction => (
          <TransactionListItem
            key={transaction.description}
            transaction={transaction}
          />
        ))}
      </List>
    </Box>
  );
}

function TransactionListItem(props) {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const enter = () => setIsHovered(true);
  const leave = () => setIsHovered(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const open = () => setIsDrawerOpen(true);
  const close = () => setIsDrawerOpen(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const { transaction } = props;

  const delTransaction = type => () => {
    switch (type) {
      case "expense":
        dispatch(deleteExpenseThunk(transaction.id));
        return;
      case "income":
        dispatch(deleteIncomeThunk(transaction.id));
        return;
      default:
        return;
    }
  };

  return (
    <>
      <ListItem
        sx={{
          "&:hover": {
            boxShadow: 2,
            borderRadius: 2,
            outline: "0.5px solid lightgray",
          },
          cursor: "pointer",
        }}
        onMouseEnter={enter}
        onMouseLeave={leave}
      >
        <Stack
          direction="row"
          sx={{
            flexGrow: 1,
          }}
          justifyContent="space-between"
        >
          <Stack direction="row">
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: colorMap[transaction.tag],
                  mr: 2,
                }}
              >
                {iconsMap[transaction.tag]}
              </Avatar>
            </ListItemAvatar>

            <Typography
              lineHeight={1.375}
              sx={{
                display: "flex",
                flexFlow: "column nowrap",
                justifyContent: "center",
                textTransform: "capitalize",
              }}
              textAlign="left"
            >
              {transaction.description}
              <br />
              <Typography lineHeight={1.375} variant="caption">
                {transaction.tag}
              </Typography>
            </Typography>
          </Stack>

          {isHovered ? (
            <Stack direction="row">
              <Tooltip arrow placement="top" title="Edit">
                <IconButton onClick={open}>
                  <Edit />
                </IconButton>
              </Tooltip>

              <Tooltip arrow placement="top" title="Delete">
                <IconButton onClick={openDialog}>
                  <DeleteOutline />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Typography
              textAlign="right"
              lineHeight={1.375}
              sx={{
                display: "flex",
                flexFlow: "column nowrap",
                justifyContent: "center",
              }}
            >
              {transaction.type === "income" ? "+" : "-"}{" "}
              {Number(transaction.value).toFixed(2)} {transaction.currency}
              <br />
              <Typography lineHeight={1.375} variant="caption">
                x{" "}
                {Number(
                  transaction.exchangeRates[transaction.currency].ask
                ).toFixed(2)}{" "}
                |{" "}
                {transaction.createdAt
                  .toLocaleDateString()
                  .split("/")
                  .slice(0, 2)
                  .join("/")}{" "}
                {transaction.createdAt.getHours()}:
                {transaction.createdAt.getMinutes().toString().padStart(2, "0")}
              </Typography>
            </Typography>
          )}
        </Stack>
      </ListItem>

      {transaction.type === "income" ? (
        <IncomeFormDrawer
          toEdit={transaction}
          open={isDrawerOpen}
          close={close}
        />
      ) : (
        <ExpenseFormDrawer
          toEdit={transaction}
          open={isDrawerOpen}
          close={close}
        />
      )}

      <ConfirmationDialog
        open={isDialogOpen}
        close={closeDialog}
        onConfirm={delTransaction(transaction.type)}
        transaction={transaction}
      />
    </>
  );
}

const ConfirmationDialog = ({ open, transaction, close, onConfirm }) => {
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Delete {transaction.type}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the {transaction.type}{" "}
          {transaction.description}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
