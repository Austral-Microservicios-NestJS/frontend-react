import { Label, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui";
import { FormGroup, FormGroupDivisor } from "@/components/shared";
import { estadoCivilOptions } from "@/types/agente-dni.interface";
import type { DniData } from "@/types/agente-dni.interface";

interface FormularioDniProps {
  formData: DniData;
  onChange: (data: DniData) => void;
  disabled?: boolean;
}

export const FormularioDni = ({ formData, onChange, disabled = false }: FormularioDniProps) => {
  const handleChange = (field: keyof DniData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <FormGroupDivisor columns={3}>
        <FormGroup>
          <Label htmlFor="numeroDni">DNI</Label>
          <Input
            id="numeroDni"
            placeholder="Ej: 12345678"
            value={formData.numeroDni}
            onChange={(e) => handleChange("numeroDni", e.target.value)}
            disabled={disabled}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="sexo">Sexo</Label>
          <Select
            value={formData.sexo}
            onValueChange={(value) => handleChange("sexo", value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="F">Femenino</SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="estadoCivil">Estado Civil</Label>
          <Select
            value={formData.estadoCivil}
            onValueChange={(value) => handleChange("estadoCivil", value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {estadoCivilOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormGroup>
      </FormGroupDivisor>

      <FormGroupDivisor columns={3}>
        <FormGroup>
          <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
          <Input
            id="apellidoPaterno"
            placeholder="Ej: García"
            value={formData.apellidoPaterno}
            onChange={(e) => handleChange("apellidoPaterno", e.target.value)}
            disabled={disabled}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
          <Input
            id="apellidoMaterno"
            placeholder="Ej: López"
            value={formData.apellidoMaterno}
            onChange={(e) => handleChange("apellidoMaterno", e.target.value)}
            disabled={disabled}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="nombres">Nombres</Label>
          <Input
            id="nombres"
            placeholder="Ej: Juan Carlos"
            value={formData.nombres}
            onChange={(e) => handleChange("nombres", e.target.value)}
            disabled={disabled}
          />
        </FormGroup>
      </FormGroupDivisor>

      <FormGroupDivisor columns={3}>
        <FormGroup>
          <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
          <Input
            id="fechaNacimiento"
            type="date"
            value={formData.fechaNacimiento}
            onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
            disabled={disabled}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="fechaEmision">Fecha de Emisión</Label>
          <Input
            id="fechaEmision"
            type="date"
            value={formData.fechaEmision}
            onChange={(e) => handleChange("fechaEmision", e.target.value)}
            disabled={disabled}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="fechaCaducidad">Fecha de Caducidad</Label>
          <Input
            id="fechaCaducidad"
            type="date"
            value={formData.fechaCaducidad}
            onChange={(e) => handleChange("fechaCaducidad", e.target.value)}
            disabled={disabled}
          />
        </FormGroup>
      </FormGroupDivisor>
    </div>
  );
};
