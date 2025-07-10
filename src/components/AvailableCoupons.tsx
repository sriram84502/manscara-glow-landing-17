
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AvailableCoupon, getAvailableCoupons } from '@/utils/couponUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Ticket } from 'lucide-react';

interface AvailableCouponsProps {
  onSelectCoupon: (couponCode: string) => void;
  currentSubtotal: number;
  appliedCouponCode?: string;
}

export function AvailableCoupons({ 
  onSelectCoupon, 
  currentSubtotal,
  appliedCouponCode 
}: AvailableCouponsProps) {
  const [coupons, setCoupons] = useState<AvailableCoupon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const availableCoupons = await getAvailableCoupons();
        setCoupons(availableCoupons);
      } catch (err) {
        setError('Failed to load available coupons');
        console.error('Error loading coupons:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm">Available Coupons</h4>
      
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : coupons.length === 0 ? (
        <p className="text-sm text-gray-500">No coupons available right now.</p>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => {
            const isApplied = appliedCouponCode === coupon.code;
            const isEligible = currentSubtotal >= coupon.minimumPurchase;
            
            return (
              <Card 
                key={coupon._id} 
                className={`border ${isApplied ? 'border-green-500' : isEligible ? 'border-gray-200 hover:border-gray-400' : 'border-gray-200 opacity-70'}`}
              >
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-gray-700" />
                      <span className="font-semibold">{coupon.code}</span>
                      {isApplied && (
                        <Badge className="bg-green-500">
                          <Check className="h-3 w-3 mr-1" /> Applied
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{coupon.description}</p>
                    <div className="text-xs text-gray-500">
                      Min. spend ₹{coupon.minimumPurchase.toFixed(2)} • 
                      {coupon.isOneTimeUse ? " One-time use" : " Multiple use"}
                    </div>
                  </div>
                  
                  {!isApplied && (
                    <Button 
                      size="sm" 
                      variant={isEligible ? "default" : "outline"}
                      onClick={() => onSelectCoupon(coupon.code)}
                      disabled={!isEligible}
                    >
                      {isEligible ? "Apply" : `Min ₹${coupon.minimumPurchase}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
