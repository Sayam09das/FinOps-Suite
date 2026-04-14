'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  DollarSign,
  LoaderCircle,
  Plus,
  Tag,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { CreateTransactionPayload } from '@/lib/api/types';

const categoryOptions = [
  'Salary',
  'Freelance',
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Hotel',
  'Flight',
  'Investment',
  'Other',
];

const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('Amount must be greater than 0.'),
  category: z.string().trim().min(1, 'Category is required.'),
  note: z
    .string()
    .trim()
    .max(160, 'Keep the note under 160 characters.')
    .optional()
    .or(z.literal('')),
  date: z.string().min(1, 'Date is required.'),
});

type FormValues = z.input<typeof formSchema>;
type SubmitValues = z.output<typeof formSchema>;

type AddTransactionModalProps = {
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateTransactionPayload) => Promise<void> | void;
};

const getDefaultValues = (): FormValues => ({
  type: 'expense',
  amount: 0,
  category: 'Food',
  note: '',
  date: new Date().toISOString().slice(0, 10),
});

export default function AddTransactionModal({
  isOpen,
  isSubmitting = false,
  onClose,
  onSubmit,
}: AddTransactionModalProps) {
  const form = useForm<FormValues, undefined, SubmitValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  const transactionType = form.watch('type');

  useEffect(() => {
    if (!isOpen) {
      form.reset(getDefaultValues());
    }
  }, [form, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (values: SubmitValues) => {
    await onSubmit?.({
      amount: values.amount,
      type: values.type,
      category: values.category.trim(),
      note: values.note?.trim() || undefined,
      date: new Date(values.date).toISOString(),
    });
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 p-4 backdrop-blur-sm sm:items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Add transaction</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create a new income or expense and refresh the dashboard instantly.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5 px-6 py-6"
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => form.setValue('type', 'income')}
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    transactionType === 'income'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  Income
                </button>

                <button
                  type="button"
                  onClick={() => form.setValue('type', 'expense')}
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    transactionType === 'expense'
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <TrendingDown className="h-4 w-4" />
                  Expense
                </button>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    {...form.register('amount')}
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-lg font-semibold text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
                    placeholder="0.00"
                  />
                </div>
                {form.formState.errors.amount ? (
                  <p className="mt-2 text-sm text-rose-600">
                    {form.formState.errors.amount.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      {...form.register('category')}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  {form.formState.errors.category ? (
                    <p className="mt-2 text-sm text-rose-600">
                      {form.formState.errors.category.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      {...form.register('date')}
                      type="date"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                    />
                  </div>
                  {form.formState.errors.date ? (
                    <p className="mt-2 text-sm text-rose-600">
                      {form.formState.errors.date.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Note
                </label>
                <textarea
                  {...form.register('note')}
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                  placeholder="Optional description for this transaction"
                />
                {form.formState.errors.note ? (
                  <p className="mt-2 text-sm text-rose-600">
                    {form.formState.errors.note.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Save transaction
                </button>
              </div>
            </form>
          </motion.div>

          <button
            type="button"
            aria-label="Close transaction modal"
            onClick={onClose}
            className="absolute inset-0 -z-10 cursor-default"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
