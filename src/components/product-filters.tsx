
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

const filterCategories = [
  { title: 'categoría', count: 1, options: ['Perfumería'] },
  { title: 'marcas', count: 19, options: ['Natura', 'Essencial', 'Kaiak', 'Homem', 'Humor', 'Biografia', 'Ilía', 'Una'] },
  { title: 'activo', count: 2, options: [] },
  { title: 'especie', count: 49, options: [] },
  { title: 'fragancia', count: 49, options: [] },
  { title: 'ocasión', count: 8, options: [] },
  { title: 'familia olfativa', count: 8, options: [] },
  { title: 'rango de precios', options: [] },
];

export function ProductFilters() {
  return (
    <Card className="p-4">
      <Accordion type="multiple" className="w-full">
        {filterCategories.map((category, index) => (
          <AccordionItem value={`item-${index}`} key={category.title}>
            <AccordionTrigger className="text-base font-medium capitalize">
              <div className="flex items-center">
                <span>{category.title}</span>
                {category.count && <span className="ml-1 text-muted-foreground">({category.count})</span>}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {category.title === 'rango de precios' ? (
                <div className="p-2">
                    <Slider defaultValue={[50]} max={100} step={1} />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>S/0</span>
                        <span>S/500</span>
                    </div>
                </div>
              ) : category.options && category.options.length > 0 ? (
                <div className="flex flex-col gap-2 p-2">
                  {category.options.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox id={`${category.title}-${option}`} />
                      <Label htmlFor={`${category.title}-${option}`} className="font-normal">{option}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-2 text-sm text-muted-foreground">No hay opciones disponibles.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
