"use client";

import * as React from "react";
import type { ContractDefinition, ContractFormValues, FormField } from "../types";
import { ChevronDownIcon, RocketIcon } from "./icons";

type Props = {
  contract: ContractDefinition;
  chainLabel: string;
  submitting: boolean;
  onSubmit: (values: ContractFormValues) => Promise<void>;
};

function buildInitialValues(fields: FormField[]) {
  return fields.reduce<ContractFormValues>((acc, field) => {
    acc[field.id] =
      field.defaultValue !== undefined ? String(field.defaultValue) : "";
    return acc;
  }, {});
}

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-slate-300">
      {label}
      {required ? <span className="ml-1 text-red-400">*</span> : null}
    </label>
  );
}

export default function DeployForm({
  contract,
  chainLabel,
  submitting,
  onSubmit,
}: Props) {
  const [values, setValues] = React.useState<ContractFormValues>(
    buildInitialValues(contract.deployFields)
  );

  React.useEffect(() => {
    setValues(buildInitialValues(contract.deployFields));
  }, [contract]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-6"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <FieldLabel label="Chain" />
          <input
            type="text"
            value={chainLabel}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-500"
          />
        </div>

        {contract.deployFields.map((field) => {
          const isFullWidth =
            field.id === "initial_owner" ||
            field.id === "strategy_registry" ||
            field.id === "executor" ||
            field.id === "fee_collector";

          return (
            <div key={field.id} className={isFullWidth ? "md:col-span-2" : ""}>
              <FieldLabel label={field.label} required={field.required} />

              {field.type === "select" || field.type === "boolean" ? (
                <div className="relative">
                  <select
                    value={values[field.id] || ""}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        [field.id]: event.target.value,
                      }))
                    }
                    className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    {(field.options || []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDownIcon
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              ) : (
                <input
                  type={field.type}
                  value={values[field.id] || ""}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.id]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  className={[
                    "w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500",
                    field.id.includes("owner") ||
                    field.id.includes("executor") ||
                    field.id.includes("collector") ||
                    field.id.includes("registry") ||
                    field.id === "treasury"
                      ? "font-mono"
                      : "",
                  ].join(" ")}
                />
              )}

              {field.helperText ? (
                <p className="mt-1 text-[10px] text-slate-500">{field.helperText}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end border-t border-slate-800 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RocketIcon size={16} />
          {submitting ? "Deploying..." : `Deploy ${contract.name}`}
        </button>
      </div>
    </form>
  );
}