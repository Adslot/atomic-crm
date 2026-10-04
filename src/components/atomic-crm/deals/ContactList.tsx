import { useListContext, useTranslate } from "ra-core";
import { Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router";

import { Avatar } from "../contacts/Avatar";
import type { Contact } from "../types";

export const ContactList = () => {
  const { data, error, isPending } = useListContext<Contact>();
  const translate = useTranslate();
  if (isPending || error) return <div className="h-8" />;
  return (
    <div className="flex flex-row flex-wrap gap-x-8 gap-y-4 mt-4">
      {data.map((contact) => (
        <div className="flex flex-row gap-4 items-start" key={contact.id}>
          <Avatar record={contact} />
          <div className="flex flex-col">
            <RouterLink
              to={`/contacts/${contact.id}/show`}
              className="text-sm hover:underline"
            >
              {contact.first_name} {contact.last_name}
            </RouterLink>
            <span className="text-xs text-muted-foreground">
              {contact.title && contact.company_name
                ? translate("resources.contacts.position_at_company", {
                    title: contact.title,
                    company: contact.company_name,
                  })
                : contact.title || contact.company_name}
            </span>
            <ContactDetails contact={contact} />
          </div>
        </div>
      ))}
    </div>
  );
};

const ContactDetails = ({ contact }: { contact: Contact }) => {
  const location = [contact.postcode, contact.region].filter(Boolean).join(" ");
  return (
    <div className="flex flex-col gap-0.5 mt-1">
      {contact.email_jsonb?.map(({ email }) => (
        <DetailRow key={email} icon={<Mail />}>
          <a href={`mailto:${email}`} className="hover:underline">
            {email}
          </a>
        </DetailRow>
      ))}
      {contact.phone_jsonb?.map(({ number }) => (
        <DetailRow key={number} icon={<Phone />}>
          <a href={`tel:${number}`} className="hover:underline">
            {number}
          </a>
        </DetailRow>
      ))}
      {location && <DetailRow icon={<MapPin />}>{location}</DetailRow>}
    </div>
  );
};

const DetailRow = ({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) => (
  <div className="flex items-center gap-1.5 text-xs text-muted-foreground [&>svg]:w-3 [&>svg]:h-3 [&>svg]:shrink-0">
    {icon}
    {children}
  </div>
);
