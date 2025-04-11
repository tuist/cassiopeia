defmodule Casiopeia.Repo do
  use Ecto.Repo,
    otp_app: :casiopeia,
    adapter: Ecto.Adapters.Postgres
end
