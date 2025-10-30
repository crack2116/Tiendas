import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Twitter, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-2xl">Natura</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Curating the future of fashion.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook size={20} />
              </Link>
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4 font-headline">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">New Arrivals</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Clothing</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Accessories</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Sale</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4 font-headline">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Track Order</Link></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-4 lg:col-span-1">
            <h3 className="font-semibold mb-4 font-headline">Stay in the Loop</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest on new arrivals, sales, and exclusive offers.
            </p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Enter your email" className="bg-background" />
              <Button type="submit" variant="default">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Natura. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
