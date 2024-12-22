import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';

import { client } from '../../../api/apiClient';
import { LabelSelector } from '../../../components/specialized/LabelSelector';
import { AuthProtected } from '../../../components/utils/AuthProtected';
import { XpmAlert } from '../../../components/XpmAlert';
import { XpmButton } from '../../../components/XpmButton';
import { XpmCard } from '../../../components/XpmCard';
import { XpmCardContent } from '../../../components/XpmCardContent';
import { XpmTextField } from '../../../components/XpmTextField';
import { XpmTypography } from '../../../components/XpmTypography';
import { withFormik } from '../../../withFormik';
import { getAllLabels, getCurrentDate } from '../expensesUtils';

type FormValues = {
  amount: string;
  description: string;
  selectedLabels: number[];
};

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

const initialValues: FormValues = {
  amount: '',
  description: '',
  selectedLabels: [],
};

const TITLE = 'Add Expenses';
const successMessage = 'Expense added successfully!';
const errorMessage = 'Failed to add expense. Please try again!';
const SUCCESS = 'success';
const ERROR = 'error';

export const AddExpenses = () => {
  const classes = useStyles();

  const { handleChange, values, handleSubmit, isSubmitting, status, setValues } = useFormikContext<FormValues>();

  const [labels, setLabels] = useState<
    {
      name: string;
      label_id: number;
      added_by_user_id: string;
      description?: string;
    }[]
  >([]);

  const getLabels = async () => {
    const lbs = await getAllLabels();
    setLabels(lbs);
  };

  useEffect(() => {
    getLabels();
  }, []);

  const handleLabelSelection = (selectedLabels: number[]) => {
    setValues({ ...values, selectedLabels });
  };

  return (
    <XpmCard sx={{ display: 'flex', justifyContent: 'center' }}>
      <XpmCardContent
        sx={{
          textAlign: 'left',
          marginTop: '30px',
          width: '400px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className={classes.container}>
            <XpmTypography variant="h4" component="h2" align="center" className={classes.title} text={TITLE} />
            {status && <XpmAlert severity={status.success ? SUCCESS : ERROR} message={status.message} />}
            <XpmTextField
              name="amount"
              required
              id="outlined-number"
              label="Amount"
              type="number"
              onChange={handleChange}
              value={values.amount}
              disabled={isSubmitting}
              color="inputsColor"
            />
            <XpmTextField
              name="description"
              required
              id="outlined-required"
              label="Description"
              onChange={handleChange}
              value={values.description}
              disabled={isSubmitting}
              color="inputsColor"
            />
            <LabelSelector labels={labels} onSelectionChange={handleLabelSelection} selectedLabels={values.selectedLabels} />
            <XpmButton disabled={isSubmitting} color="secondary" buttonName="Add" type="submit" variant="contained" fullWidth />
          </div>
        </form>
      </XpmCardContent>
    </XpmCard>
  );
};

const handleSubmit = async (values, { setSubmitting, setStatus, resetForm }) => {
  try {
    await client.expenses.create.mutate([
      {
        description: values.description,
        amount: values.amount,
        date_expended_at: getCurrentDate(),
        label_ids: values.selectedLabels,
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

const AddExpensesWithFormik = withFormik(initialValues, handleSubmit, AddExpenses);

export default AddExpensesWithFormik;

export const ProtectedAddExpensesPage = () => (
  <AuthProtected>
    <AddExpensesWithFormik />
  </AuthProtected>
);
