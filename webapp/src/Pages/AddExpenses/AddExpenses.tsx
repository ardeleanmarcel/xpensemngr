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
import { withFormik } from '../../withFormik';
import { useFormikContext } from 'formik';
import { client } from '../../api/apiClient';

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

export const AddExpenses = () => {
  const classes = useStyles();

  const { handleChange, values, handleSubmit, isSubmitting, status } =
    useFormikContext<typeof initialValues>();

  console.log('🚀 ~ AddExpenses ~ status:', status);

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
              Add Expenses
            </Typography>
            {status && (
              <Alert severity={status.success ? 'success' : 'error'}>
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

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const handleSubmit = async (
  values,
  { setSubmitting, setStatus, resetForm }
) => {
  console.log(getCurrentDate());
  try {
    await client.expenses.create.mutate([
      {
        description: values.description,
        amount: values.amount,
        date_expended_at: getCurrentDate(),
      },
    ]);
    setSubmitting(false);
    resetForm();
    setStatus({ success: true, message: 'Expense added successfully!' });
  } catch (error) {
    setStatus({
      success: false,
      message: 'Failed to add expense. Please try again.',
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
