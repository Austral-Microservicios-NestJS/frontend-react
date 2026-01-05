import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientes } from "@/hooks/useCliente";
import { Cake, Gift } from "lucide-react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/es";

dayjs.extend(isBetween);
dayjs.locale("es");

export const BirthdayWidget = () => {
  const { clientes, isLoading } = useClientes();

  const today = dayjs();
  const currentYear = today.year();

  const birthdayClients = clientes
    .filter((c) => c.cumpleanos && c.tipoPersona === "NATURAL")
    .map((c) => {
      if (!c.cumpleanos) return null;

      const birthDate = dayjs(c.cumpleanos);
      let birthdayThisYear = birthDate.year(currentYear);

      if (birthdayThisYear.isBefore(today, "day")) {
        birthdayThisYear = birthdayThisYear.add(1, "year");
      }

      return {
        ...c,
        nextBirthday: birthdayThisYear,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .filter((c) => {
      return c.nextBirthday.isBetween(today, "day", "day", "[]");
    })
    .sort((a, b) => a.nextBirthday.diff(b.nextBirthday))
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card className="h-full border-none shadow-sm ring-1 ring-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-900">
            Próximos Cumpleaños
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-50 rounded-md animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none shadow-sm ring-1 ring-gray-200 hover:ring-gray-300 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-[--austral-azul] rounded-md">
            <Cake className="w-4 h-4" />
          </div>
          Próximos Cumpleaños
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          {birthdayClients.length > 0 ? (
            birthdayClients.map((client) => (
              <div
                key={client.idCliente}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shrink-0 border border-pink-100">
                    <Gift className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {client.nombres} {client.apellidos}{" "}
                      {client.tipoPersona === "NATURAL"
                        ? "(Natural)"
                        : "(Jurídico)"}
                      {" - "}
                      {client.numeroDocumento}
                    </p>
                    <p className="text-xs text-gray-500">
                      {client.nextBirthday.format("D [de] MMMM")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No hay cumpleaños cercanos.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
