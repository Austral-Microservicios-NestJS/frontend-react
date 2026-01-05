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
    <Card className="h-full border-none shadow-sm ring-1 ring-gray-200 hover:ring-gray-300 transition-all bg-white overflow-hidden relative group">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 opacity-10" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <CardHeader className="pb-3 pt-4 px-4 relative z-10">
        <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-lg shadow-sm">
            <Cake className="w-3.5 h-3.5" />
          </div>
          Próximos Cumpleaños
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 relative z-10">
        <div className="space-y-2.5">
          {birthdayClients.length > 0 ? (
            birthdayClients.map((client) => {
              const isToday = client.nextBirthday.isSame(today, "day");
              return (
                <div
                  key={client.idCliente}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all border ${
                    isToday
                      ? "bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 shadow-sm scale-[1.02]"
                      : "bg-white border-gray-100 hover:border-pink-200 hover:shadow-sm hover:bg-pink-50/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                        isToday
                          ? "bg-gradient-to-br from-pink-400 to-purple-500 text-white border-transparent"
                          : "bg-gray-50 text-gray-400 border-gray-100"
                      }`}
                    >
                      {isToday ? (
                        <Gift className="w-4 h-4 animate-bounce" />
                      ) : (
                        <span className="text-xs font-bold">
                          {client.nombres?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold line-clamp-1 ${
                          isToday ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {client.nombres} {client.apellidos}
                      </p>
                      <p
                        className={`text-[10px] font-medium ${
                          isToday ? "text-pink-600" : "text-gray-400"
                        }`}
                      >
                        {isToday
                          ? "¡Es hoy! 🎉"
                          : client.nextBirthday.format("D [de] MMMM")}
                      </p>
                    </div>
                  </div>

                  {isToday && (
                    <div className="text-[10px] font-bold bg-white text-pink-600 px-2 py-0.5 rounded-full shadow-sm border border-pink-100">
                      Hoy
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <Cake className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-gray-500">
                No hay cumpleaños próximos
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
