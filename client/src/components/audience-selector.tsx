import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AudienceOption, RelationshipOption } from "@/lib/types";
import { Users, ArrowUpDown } from "lucide-react";

interface AudienceSelectorProps {
  audience: AudienceOption;
  relationship: RelationshipOption;
  onAudienceChange: (audience: AudienceOption) => void;
  onRelationshipChange: (relationship: RelationshipOption) => void;
}

export function AudienceSelector({
  audience,
  relationship,
  onAudienceChange,
  onRelationshipChange,
}: AudienceSelectorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap" data-testid="panel-audience-selector">
      <div className="flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5 text-muted-foreground" />
        <Select value={audience} onValueChange={(v) => onAudienceChange(v as AudienceOption)}>
          <SelectTrigger className="text-xs w-[120px]" data-testid="select-audience">
            <SelectValue placeholder="Audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recruiter">Recruiter</SelectItem>
            <SelectItem value="professor">Professor</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="teammate">Teammate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1.5">
        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        <Select value={relationship} onValueChange={(v) => onRelationshipChange(v as RelationshipOption)}>
          <SelectTrigger className="text-xs w-[110px]" data-testid="select-relationship">
            <SelectValue placeholder="Relation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="senior">To Senior</SelectItem>
            <SelectItem value="junior">To Junior</SelectItem>
            <SelectItem value="peer">To Peer</SelectItem>
            <SelectItem value="customer">To Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
