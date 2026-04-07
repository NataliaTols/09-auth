'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api";
import { useNoteDraftStore } from '@/lib/store/noteStore';

type TagType = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

interface FormData {
  title: string;
  content: string;
  tag: TagType;
}

interface FormErrors {
  title?: string;
  content?: string;
  tag?: string;
}

const TAGS: TagType[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Title is required";
  } else if (data.title.length < 3) {
    errors.title = "Minimum 3 characters";
  } else if (data.title.length > 50) {
    errors.title = "Maximum 50 characters";
  }

  if (data.content.length > 500) {
    errors.content = "Maximum 500 characters";
  }

  if (!TAGS.includes(data.tag)) {
    errors.tag = "Tag is required";
  }

  return errors;
};

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const [formData, setFormData] = useState<FormData>(draft);
  const [errors, setErrors] = useState<FormErrors>({});

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
    onError: () => {
      setErrors({ title: "Failed to create note. Please try again." });
    },
  });

  useEffect(() => {
    setFormData(draft);
  }, [draft]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    setDraft({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    mutation.mutate(formData);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <label className={css.formGroup}>
        Title
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={css.input}
          placeholder="Enter note title"
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </label>

      <label className={css.formGroup}>
        Content
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className={css.textarea}
          placeholder="Enter note content"
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </label>

      <label className={css.formGroup}>
        Tag
        <select
          name="tag"
          value={formData.tag}
          onChange={handleChange}
          className={css.select}
        >
          {TAGS.map((tagOption) => (
            <option key={tagOption} value={tagOption}>
              {tagOption}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </label>

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create"}
        </button>

        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}