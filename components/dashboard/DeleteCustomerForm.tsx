"use client";

type DeleteCustomerFormProps = {
  action: string;
  customerName: string;
};

export function DeleteCustomerForm({ action, customerName }: DeleteCustomerFormProps) {
  return (
    <form
      action={action}
      method="post"
      onSubmit={(event) => {
        const confirmed = window.confirm(`Kunde "${customerName}" wirklich komplett löschen? Alle zugehörigen Daten werden ebenfalls entfernt.`);
        if (!confirmed) event.preventDefault();
      }}
    >
      <input type="hidden" name="_intent" value="delete" />
      <button className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-red-200 bg-white px-4 text-sm font-bold text-red-700 hover:bg-red-50">
        Kunde komplett löschen
      </button>
    </form>
  );
}
