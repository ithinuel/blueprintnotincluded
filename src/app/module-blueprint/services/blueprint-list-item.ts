// SHARED CODE
export interface BlueprintListItem
{
  id: string;
  name: string;
  ownerName: string;
  tags: string[];
  createdAt: Date;
  modifiedAt: Date;
  thumbnail: string;
}