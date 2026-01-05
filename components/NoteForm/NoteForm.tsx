import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api';



interface NoteFormValues {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

interface NoteFormProps {
  onClose: () => void;
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Мінімум 3 символи')
    .max(50, 'Максимум 50 символів')
    .required('Обов’язкове поле'),
  content: Yup.string().max(500, 'Максимум 500 символів'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Обов’язкове поле'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  

  const createMutation = useMutation({
    mutationFn: createNote,
   onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['notes'] });
  onClose();
}
  });

  const handleSubmit = (
    values: NoteFormValues,
    helpers: FormikHelpers<NoteFormValues>
  ) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        helpers.resetForm();
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ resetForm }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage name="title">
              {msg => <span className={css.error}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content">
              {msg => <span className={css.error}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag">
              {msg => <span className={css.error}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}