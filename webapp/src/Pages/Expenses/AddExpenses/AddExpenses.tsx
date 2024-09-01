import { useFormikContext } from 'formik';
import {
  Alert,
  Button,
  Card,
  CardContent,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { withFormik } from '../../../withFormik';
import { client } from '../../../api/apiClient';
import { getCurrentDate } from './expensesUtils';

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'grid',
    gap: '50px',
  },
  title: {
    color: theme.palette.text.primary,
    marginTop: '40px !important',
    //TODO -> remove '!important'
  },
  actionText: {
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.text.primary,
  },
}));

const initialValues = {
  amount: '',
  description: '',
};

const TITLE = 'Add Expenses';
const successMessage = 'Expense added successfully!';
const errorMessage = 'Failed to add expense. Please try again!';
const SUCCESS = 'success';
const ERROR = 'error';

export const AddExpenses = () => {
  const classes = useStyles();

  const { handleChange, values, handleSubmit, isSubmitting, status } =
    useFormikContext<typeof initialValues>();

  return (
    <Card>
      <CardContent
        sx={{
          textAlign: 'left',
          marginTop: '30px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className={classes.container}>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              className={classes.title}
            >
              {TITLE}
            </Typography>
            {status && (
              <Alert severity={status.success ? SUCCESS : ERROR}>
                {status.message}
              </Alert>
            )}
            <TextField
              name="amount"
              required
              id="outlined-number"
              label="Amount"
              type="number"
              onChange={handleChange}
              value={values.amount}
              disabled={isSubmitting}
            />
            <TextField
              name="description"
              required
              id="outlined-required"
              label="Description"
              onChange={handleChange}
              value={values.description}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{
                boxShadow: 3,
              }}
              fullWidth
              disabled={isSubmitting}
            >
              Add
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const handleSubmit = async (
  values,
  { setSubmitting, setStatus, resetForm }
) => {
  try {
    await client.expenses.create.mutate([
      {
        description: values.description,
        amount: values.amount,
        date_expended_at: getCurrentDate(),
      },
    ]);
    resetForm();
    setStatus({ success: true, message: successMessage });
  } catch (error) {
    setStatus({
      success: false,
      message: errorMessage,
    });
    resetForm();
  } finally {
    setSubmitting(false);
  }
};

const AddExpensesWithFormik = withFormik(
  initialValues,
  handleSubmit,
  AddExpenses
);

export default AddExpensesWithFormik;
