
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
    { 
        title: 'categoría', 
        options: ['Tops', 'Jeans', 'Jackets', 'Knitwear', 'Footwear', 'Dresses', 'Perfumería', 'Rostro', 'Cabello', 'Cuerpo', 'Maquillaje'] 
    },
    { 
        title: 'marcas', 
        options: ['Natura', 'Essencial', 'Kaiak', 'Homem', 'Humor', 'Biografia', 'Ilía', 'Una', 'Noemia'] 
    },
    { 
        title: 'familia olfativa', 
        options: ['Oriental Floral', 'Amaderado', 'Cítrico', 'Fresco'] 
    },
    { 
        title: 'rango de precios', 
        options: [] 
    },
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
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {category.title === 'rango de precios' ? (
                <div className="p-2">
                    <Slider defaultValue={[250]} max={500} step={1} />
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
