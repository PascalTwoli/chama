import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChamaService from '../services/chama/chama-services';

interface UseChamaIdReturn {
  chamaId: string | undefined;
  chamaData: any | null;
  isLoading: boolean;
  error: string | null;
}

export const useChamaId = (): UseChamaIdReturn => {
  const { chamaId } = useParams<{ chamaId: string }>();
  const [chamaData, setChamaData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChamaData = async () => {
      if (!chamaId) {
        setError('No chama ID provided');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await ChamaService.getChamaById(chamaId);
        setChamaData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch chama data'
        );
        setChamaData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChamaData();
  }, [chamaId]);

  return {
    chamaId,
    chamaData,
    isLoading,
    error,
  };
};
