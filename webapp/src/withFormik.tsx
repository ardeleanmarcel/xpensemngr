import { Formik } from 'formik'

export const withFormik = (initialValues, onSubmit, Component) => {
  return () => (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Component />
    </Formik>
  )
}
